import OriginTable from "@/components/comp-485";

export default function TransactionsPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
      </div>
      <div className="w-full">
        <OriginTable />
      </div>
    </>
  )
}

