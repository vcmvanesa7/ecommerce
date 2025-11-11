'use client';
type Props = { label: string; onClick?: () => void; disabled?: boolean };

export default function Button({ label, onClick, disabled }: Props) {
  return <button disabled={disabled} onClick={onClick}>{label}</button>;
}
