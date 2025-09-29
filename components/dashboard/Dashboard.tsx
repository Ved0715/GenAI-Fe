"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Clock
} from "lucide-react"

interface User {
  id?: string
  name?: string
  email?: string
}

interface DashboardProps {
  user: User | null
}

export function Dashboard({ user }: DashboardProps) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name || "User"}!
        </h1>
        <p className="text-muted-foreground">
          Here's your dashboard overview.
        </p>
      </div>

      {/* Two Horizontal Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card
          className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2 border-dashed border-primary/20 hover:border-primary/50"
          onClick={() => window.location.href = `/chat/${user?.id || 'default'}`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Start AI Chat
            </CardTitle>
            <CardDescription>
              Chat with your personal AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <div className="text-4xl">💬</div>
                  <p className="text-sm text-muted-foreground">Click to start chatting</p>
                </div>
              </div>
              <div className="flex justify-center">
                <Button className="w-full" variant="outline">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Open Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Stats
            </CardTitle>
            <CardDescription>
              Recent activity and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Projects</span>
                <span className="text-2xl font-bold">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Team Members</span>
                <span className="text-2xl font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* One Large Card Below */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest updates and team activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "New project created",
                user: "John Smith",
                time: "2 minutes ago",
                avatar: "JS"
              },
              {
                action: "Team meeting scheduled",
                user: "Sarah Wilson",
                time: "15 minutes ago",
                avatar: "SW"
              },
              {
                action: "Report generated",
                user: "Mike Johnson",
                time: "1 hour ago",
                avatar: "MJ"
              },
              {
                action: "Settings updated",
                user: "Emma Davis",
                time: "2 hours ago",
                avatar: "ED"
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={activity.user} />
                  <AvatarFallback>{activity.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">by {activity.user}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}