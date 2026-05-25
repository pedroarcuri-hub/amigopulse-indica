import {
  CardRadioGroup,
  CardRadioGroupLabel,
  type CardRadioOption,
} from "./shared/CardRadioGroup";
import {
  REFERRAL_FORM_TYPE_DESCRIPTION,
  REFERRAL_FORM_TYPE_ICON,
  REFERRAL_FORM_TYPE_LABEL,
} from "./constants";
import type { ReferralFormType } from "./types";

const TYPES: ReferralFormType[] = ["company", "professional", "student"];

const options: CardRadioOption<ReferralFormType>[] = TYPES.map((t) => ({
  value: t,
  label: REFERRAL_FORM_TYPE_LABEL[t],
  description: REFERRAL_FORM_TYPE_DESCRIPTION[t],
  icon: REFERRAL_FORM_TYPE_ICON[t],
}));

interface ReferralTypeSelectorProps {
  value: ReferralFormType;
  onChange: (value: ReferralFormType) => void;
  disabled?: boolean;
}

export function ReferralTypeSelector({
  value,
  onChange,
  disabled,
}: ReferralTypeSelectorProps) {
  return (
    <div>
      <CardRadioGroupLabel>Qual o perfil do indicado?</CardRadioGroupLabel>
      <CardRadioGroup
        value={value}
        onChange={onChange}
        options={options}
        disabled={disabled}
      />
    </div>
  );
}
