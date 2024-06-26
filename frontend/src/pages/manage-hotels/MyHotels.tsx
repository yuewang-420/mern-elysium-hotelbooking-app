const MyHotels = () => {
  return (
    <section className="w-full px-8 py-4 divide-y flex flex-col gap-6">
      <span className="flex flex-col gap-2">
        <h2 className="text-xl md:text-3xl font-semibold text-neutral-800">
          My hotels
        </h2>
        <p className="text-xs md:text-sm font-medium text-neutral-800">
          Have an overview of all your hotels. You can simply select one hotel
          to view its details or edit it.
        </p>
      </span>
    </section>
  )
}

export default MyHotels
