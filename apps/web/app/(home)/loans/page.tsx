import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Progress } from "@workspace/ui/components/progress"
import { Badge } from "@workspace/ui/components/badge"
import { PlusCircle, Search } from "lucide-react"

const loans = [
  {
    id: 1,
    name: "Personal Loan",
    amount: 5000,
    progress: 75,
    status: "Active",
    nextPayment: "Feb 15, 2025",
    paymentAmount: 789,
  },
  {
    id: 2,
    name: "Home Improvement",
    amount: 15000,
    progress: 45,
    status: "Active",
    nextPayment: "Feb 20, 2025",
    paymentAmount: 1200,
  },
  {
    id: 3,
    name: "Business Loan",
    amount: 25000,
    progress: 20,
    status: "Active",
    nextPayment: "Feb 28, 2025",
    paymentAmount: 2100,
  },
  {
    id: 4,
    name: "Education Loan",
    amount: 10000,
    progress: 0,
    status: "Pending",
    nextPayment: "Not Started",
    paymentAmount: 950,
  },
]

export default function Loans() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 pt-0">
      {/* Header with Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Loans</h1>
          <p className="text-sm text-muted-foreground">
            Manage your active loans and applications
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Loan
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search loans..." className="pl-8" />
              </div>
            </div>
            <div className="flex gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loans List */}
      <div className="grid gap-4">
        {loans.map((loan) => (
          <Card key={loan.id}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{loan.name}</h3>
                    <Badge variant={loan.status === "Active" ? "default" : "secondary"}>
                      {loan.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Next Payment: {loan.nextPayment}
                  </p>
                </div>
                <div className="flex flex-col gap-2 md:items-end">
                  <div className="text-xl font-bold">
                    ${loan.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${loan.paymentAmount}/month
                  </div>
                </div>
                <div className="w-full md:w-1/3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Progress</span>
                    <span className="text-sm font-medium">{loan.progress}%</span>
                  </div>
                  <Progress value={loan.progress} className="h-2" />
                </div>
                <Button variant="outline">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
