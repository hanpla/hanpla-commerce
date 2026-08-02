"use client";

import { useState } from "react";
import MapPinIcon from "@/components/icons/map-pin-icon";
import AddressModal from "@/components/mypage/address-modal";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import useAuth from "@/lib/hooks/use-auth";
import { DeliveryAddress } from "@/types/user";

const AddressesPage = () => {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: DeliveryAddress) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleSave = (addressData: Omit<DeliveryAddress, "id" | "userId">) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, addressData);
    } else {
      addAddress(addressData);
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

      {addresses.length === 0 ? (
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
                      onClick={() => setDefaultAddress(addr.id)}
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
                    onClick={() => deleteAddress(addr.id)}
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
