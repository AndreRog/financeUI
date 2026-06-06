export function GuestSupportedBanks() {
  const banks = [
    { short: 'CGD', name: 'Caixa Geral de Depósitos' },
    { short: 'SAN', name: 'Santander' },
  ]
  return (
    <div className="gl-banks center">
      <span className="gl-banks-label">Works with</span>
      {banks.map((b) => (
        <span key={b.short} className="gl-bank">
          <span className="gl-account-badge">{b.short}</span>
          {b.name}
        </span>
      ))}
      <span className="gl-more">more banks soon</span>
    </div>
  )
}
