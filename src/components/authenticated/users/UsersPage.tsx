import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function UsersPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Example user cards - replace with actual data */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                <AvatarFallback>U{i}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">User {i}</CardTitle>
                <p className="text-sm text-gray-500">user{i}@example.com</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                This is a sample user card. Replace with actual user data.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 