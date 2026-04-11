"use client"

export function AddressBook({ addresses, userId }: { addresses: any[]; userId: string }) {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-24 border border-site-border bg-white">
        <h2 className="font-cormorant text-2xl font-light mb-4">No addresses saved</h2>
        <p className="font-mono text-xs tracking-widest text-muted mb-8">ADD A DELIVERY ADDRESS</p>
        <button className="font-mono text-xs tracking-widest uppercase border border-ink px-8 py-3 hover:bg-ink hover:text-white transition-colors">
          Add New Address
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {addresses.map(address => (
        <div key={address.id} className="bg-white border border-site-border p-6 hover:border-ink transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-mono text-sm tracking-widest uppercase">{address.label || "Home"}</h3>
            {address.isDefault && <span className="text-[10px] font-mono tracking-widest bg-ink text-white px-2 py-1 uppercase">Default</span>}
          </div>
          <p className="font-sans text-sm text-muted">{address.line1}</p>
          {address.line2 && <p className="font-sans text-sm text-muted">{address.line2}</p>}
          <p className="font-sans text-sm text-muted">{address.city}, {address.state} {address.postalCode}</p>
          <p className="font-sans text-sm text-muted">{address.country}</p>
        </div>
      ))}
      <button className="font-mono text-xs tracking-widest uppercase border border-ink w-full py-4 mt-8 hover:bg-ink hover:text-white transition-colors">
        Add New Address
      </button>
    </div>
  )
}
