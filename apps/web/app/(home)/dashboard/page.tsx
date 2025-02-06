import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Progress } from "@workspace/ui/components/progress"
import { ArrowRight, ArrowUpRight, Wallet, Clock, CheckCircle } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 pt-0">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              +20.1% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 pending approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Feb 15</div>
            <p className="text-xs text-muted-foreground">
              $789.00 due
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-5">
        {/* Active Loans */}
        <div className="space-y-4 md:col-span-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Loans</CardTitle>
                  <CardDescription>Your current active loans and their status</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { name: "Personal Loan", amount: 5000, progress: 75 },
                  { name: "Home Improvement", amount: 15000, progress: 45 },
                  { name: "Business Loan", amount: 25000, progress: 20 },
                ].map((loan) => (
                  <div key={loan.name} className="flex items-center">
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">
                        {loan.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${loan.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="ml-auto font-medium w-1/3">
                      <Progress value={loan.progress} className="h-2" />
                      <p className="text-sm text-right mt-1">{loan.progress}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4 md:col-span-3 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { type: "Payment Made", amount: -789, date: "Today" },
                  { type: "Loan Approved", amount: 15000, date: "Yesterday" },
                  { type: "Payment Made", amount: -1200, date: "Jan 30" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.type}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                    <div className={`ml-auto font-medium ${activity.amount > 0 ? "text-green-500" : ""}`}>
                      {activity.amount > 0 ? "+" : ""}${Math.abs(activity.amount).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
