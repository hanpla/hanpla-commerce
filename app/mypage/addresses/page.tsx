"use client";

import { useEffect, useState } from "react";
import MapPinIcon from "@/components/icons/map-pin-icon";
import AddressModal from "@/components/mypage/address-modal";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import useAuth from "@/lib/hooks/use-auth";
import {
  fetchUserAddressesFromDb,
  addAddressToDb,
  updateAddressInDb,
  deleteAddressFromDb,
  setDefaultAddressInDb,
} from "@/lib/api/address-db";
import { DeliveryAddress } from "@/types/user";

const AddressesPage = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);

  const fetchAddresses = async (userId: string) => {
    try {
      const dbAddresses = await fetchUserAddressesFromDb(userId);
      setAddresses(dbAddresses);
    } catch {
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadAddresses = async () => {
      if (!user?.id) {
        if (isMounted) {
          setAddresses([]);
          setIsLoading(false);
        }
        return;
      }

      try {
        const dbAddresses = await fetchUserAddressesFromDb(user.id);
        if (isMounted) {
          setAddresses(dbAddresses);
        }
      } catch {
        if (isMounted) {
          setAddresses([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAddresses();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: DeliveryAddress) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleSave = async (addressData: Omit<DeliveryAddress, "id" | "userId">) => {
    if (!user?.id) return;

    if (editingAddress) {
      // Optimistic update
      const updated = addresses.map((addr) => {
        if (addr.id === editingAddress.id) {
          return { ...addr, ...addressData };
        }
        if (addressData.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      });
      setAddresses(updated);

      try {
        await updateAddressInDb(user.id, editingAddress.id, addressData);
        await fetchAddresses(user.id);
      } catch {
        await fetchAddresses(user.id);
      }
    } else {
      const tempId = `temp_${Date.now()}`;
      const newAddress: DeliveryAddress = {
        ...addressData,
        id: tempId,
        userId: user.id,
        isDefault: addressData.isDefault || addresses.length === 0,
      };

      const updated = addresses.map((a) =>
        addressData.isDefault ? { ...a, isDefault: false } : a
      );
      setAddresses([newAddress, ...updated]);

      try {
        await addAddressToDb(user.id, {
          ...addressData,
          isDefault: addressData.isDefault || addresses.length === 0,
        });
        await fetchAddresses(user.id);
      } catch {
        await fetchAddresses(user.id);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.id) return;
    const target = addresses.find((a) => a.id === id);
    const filtered = addresses.filter((a) => a.id !== id);

    if (target?.isDefault && filtered.length > 0) {
      filtered[0].isDefault = true;
    }

    setAddresses(filtered);

    try {
      await deleteAddressFromDb(user.id, id);
      if (target?.isDefault && filtered.length > 0) {
        await setDefaultAddressInDb(user.id, filtered[0].id);
      }
      await fetchAddresses(user.id);
    } catch {
      await fetchAddresses(user.id);
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user?.id) return;
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );

    try {
      await setDefaultAddressInDb(user.id, id);
      await fetchAddresses(user.id);
    } catch {
      await fetchAddresses(user.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-neutral-900">배송지 관리</h2>
          <p className="mt-1 text-xs text-neutral-500">
            주문 시 사용할 배송지 목록을 등록하고 관리합니다.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          className="rounded-xl font-bold"
        >
          + 새 배송지 추가
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 py-12 text-center">
          <MapPinIcon className="mx-auto h-8 w-8 text-neutral-300" />
          <p className="mt-2 text-xs font-semibold text-neutral-500">등록된 배송지가 없습니다.</p>
          <Button variant="outline" size="sm" onClick={handleOpenAdd} className="mt-4 rounded-xl">
            배송지 추가하기
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`rounded-2xl border p-5 transition-all ${
                addr.isDefault
                  ? "border-neutral-900 bg-neutral-50/50 shadow-sm"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-neutral-900">{addr.name}</span>
                  {addr.isDefault && (
                    <Badge variant="dark" className="px-1.5 py-0.5 text-[9px]">
                      기본 배송지
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs font-bold text-neutral-500 hover:text-neutral-900"
                    >
                      기본 설정
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenEdit(addr)}
                    className="text-xs font-bold text-neutral-600 hover:text-neutral-900"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-xs font-bold text-rose-500 hover:text-rose-700"
                  >
                    삭제
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-xs text-neutral-600">
                <p className="font-semibold text-neutral-800">
                  {addr.recipient} &bull; {addr.phone}
                </p>
                <p>
                  [{addr.zipcode}] {addr.address} {addr.addressDetail}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressModal
        key={isModalOpen ? editingAddress?.id || "new" : "closed"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingAddress}
      />
    </div>
  );
};

export default AddressesPage;
