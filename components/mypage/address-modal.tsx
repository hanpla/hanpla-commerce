"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { DeliveryAddress } from "@/types/user";

import { formatPhoneNumber, formatZipcode } from "@/lib/utils/format";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addressData: Omit<DeliveryAddress, "id" | "userId">) => void;
  initialData?: DeliveryAddress | null;
}

const AddressModal = ({ isOpen, onClose, onSave, initialData }: AddressModalProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [recipient, setRecipient] = useState(initialData?.recipient || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [zipcode, setZipcode] = useState(initialData?.zipcode || "06164");
  const [address, setAddress] = useState(initialData?.address || "");
  const [addressDetail, setAddressDetail] = useState(initialData?.addressDetail || "");
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !recipient || !phone || !address) return;

    onSave({
      name,
      recipient,
      phone,
      zipcode,
      address,
      addressDetail,
      isDefault,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "배송지 수정" : "새 배송지 추가"}>
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div>
          <label className="mb-1 block text-xs font-bold text-neutral-700 uppercase">
            배송지 별칭 (예: 우리집, 회사)
          </label>
          <Input
            type="text"
            required
            placeholder="우리집"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-bold text-neutral-700 uppercase">
              수령인
            </label>
            <Input
              type="text"
              required
              placeholder="홍길동"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-neutral-700 uppercase">
              연락처
            </label>
            <Input
              type="tel"
              required
              placeholder="010-1234-5678"
              value={phone}
              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-neutral-700 uppercase">
            우편번호 및 기본주소
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              required
              placeholder="06164"
              value={zipcode}
              onChange={(e) => setZipcode(formatZipcode(e.target.value))}
              className="w-28"
            />
            <Input
              type="text"
              required
              placeholder="서울 강남구 영동대로 513"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-neutral-700 uppercase">
            상세주소
          </label>
          <Input
            type="text"
            placeholder="101동 1204호"
            value={addressDetail}
            onChange={(e) => setAddressDetail(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isDefault"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
          />
          <label htmlFor="isDefault" className="text-xs font-medium text-neutral-700">
            기본 배송지로 설정
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" variant="primary" size="sm">
            저장
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddressModal;
