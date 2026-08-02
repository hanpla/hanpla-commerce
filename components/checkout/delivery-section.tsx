"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import useAuth from "@/lib/hooks/use-auth";
import { fetchUserAddressesFromDb } from "@/lib/api/address-db";
import { formatPhoneNumber } from "@/lib/utils/format";
import { DeliveryAddress } from "@/types/user";

export type DeliveryInfo = {
  recipient: string;
  phone: string;
  zipcode: string;
  address: string;
  addressDetail: string;
};

type DeliverySectionProps = {
  value: DeliveryInfo;
  onChange: (info: DeliveryInfo) => void;
};

// 로컬 헬퍼: 배송지 선택 모달
const AddressSelectModal = ({
  addresses,
  isOpen,
  onClose,
  onSelect,
}: {
  addresses: DeliveryAddress[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (addr: DeliveryAddress) => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="text-base font-bold text-neutral-900">배송지 선택</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900">
            ✕
          </button>
        </div>

        <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
          {addresses.length === 0 ? (
            <p className="py-8 text-center text-xs text-neutral-400">
              저장된 배송지가 없습니다. 마이페이지에서 새 배송지를 등록해보세요.
            </p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => {
                  onSelect(addr);
                  onClose();
                }}
                className="cursor-pointer rounded-2xl border border-neutral-200 p-4 transition-all hover:border-neutral-900 hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">{addr.name}</span>
                  {addr.isDefault && (
                    <span className="rounded-md bg-neutral-900 px-2 py-0.5 text-[10px] font-bold text-white">
                      기본 배송지
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-neutral-700">
                  {addr.recipient} ({addr.phone})
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  [{addr.zipcode}] {addr.address} {addr.addressDetail}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mt-6">
          <Button variant="outline" size="sm" onClick={onClose} className="w-full rounded-xl">
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
};

// 메인 DeliverySection 컴포넌트
const DeliverySection = ({ value, onChange }: DeliverySectionProps) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserAddressesFromDb(user.id).then((list) => {
        setAddresses(list);
        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          onChange({
            recipient: defaultAddr.recipient,
            phone: defaultAddr.phone,
            zipcode: defaultAddr.zipcode,
            address: defaultAddr.address,
            addressDetail: defaultAddr.addressDetail,
          });
        } else {
          onChange({
            recipient: user.name || "",
            phone: user.phone || "",
            zipcode: "",
            address: "",
            addressDetail: "",
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleSelectAddress = (addr: DeliveryAddress) => {
    onChange({
      recipient: addr.recipient,
      phone: addr.phone,
      zipcode: addr.zipcode,
      address: addr.address,
      addressDetail: addr.addressDetail,
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <h3 className="text-base font-bold text-neutral-900">배송지 정보</h3>
        {addresses.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl text-xs"
          >
            배송지 변경 ({addresses.length})
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-neutral-700">수령인</label>
          <Input
            value={value.recipient}
            onChange={(e) => onChange({ ...value, recipient: e.target.value })}
            placeholder="수령인 성함"
            className="rounded-xl text-xs"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-neutral-700">연락처</label>
          <Input
            value={value.phone}
            onChange={(e) => onChange({ ...value, phone: formatPhoneNumber(e.target.value) })}
            placeholder="010-0000-0000"
            className="rounded-xl text-xs"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-neutral-700">우편번호</label>
          <Input
            value={value.zipcode}
            onChange={(e) => onChange({ ...value, zipcode: e.target.value })}
            placeholder="06134"
            className="rounded-xl text-xs"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-neutral-700">기본 주소</label>
          <Input
            value={value.address}
            onChange={(e) => onChange({ ...value, address: e.target.value })}
            placeholder="도로명 주소 또는 지번 주소"
            className="rounded-xl text-xs"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-neutral-700">상세 주소</label>
          <Input
            value={value.addressDetail}
            onChange={(e) => onChange({ ...value, addressDetail: e.target.value })}
            placeholder="동, 호수 등 상세 주소 입력"
            className="rounded-xl text-xs"
          />
        </div>
      </div>

      <AddressSelectModal
        addresses={addresses}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectAddress}
      />
    </div>
  );
};

export default DeliverySection;
