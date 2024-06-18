const PaymentMethods = () => {
  return (
    <section className="w-full px-8 py-4 divide-y flex flex-col gap-6">
      <span className="flex flex-col gap-2">
        <h2 className="text-xl md:text-3xl font-semibold text-neutral-800">
          Payment methods
        </h2>
        <p className="text-xs md:text-sm font-medium text-neutral-800">
          Add or remove your payment methods here for easier payments
        </p>
      </span>
    </section>
  )
}

export default PaymentMethods
