"use client"

import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { User } from "@supabase/supabase-js"
import { ColumnDef, PaginationState, Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState, useTransition } from "react"
import { PROFILE_STORE_FIELDS } from "@/lib/constants"
import { DialogTitle } from "@radix-ui/react-dialog"
import { deleteUser as _deleteUser, countUsers, deleteMultipleUsers } from "@/actions/user"
import { Checkbox } from "@/components/ui/checkbox"

import { getHumanReadableRole } from "@/lib/utils"

const USER_TABLE_COLUMNS: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={value => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "user_metadata.role_code",
    header: "Role",
    cell: ({ row }) => getHumanReadableRole(row.original.user_metadata.role_code)
  },
  {
    accessorKey: "created_at",
    header: "Joined at",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleString()
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <UserDialog user={row.original} />
    )
  }
]

const PAGE_SIZE = 10

interface UserDialogProps {
  user: User
}
function UserDialog({ user }: UserDialogProps) {
  const supabase = createClient()
  const [profile, setProfile] = useState<Record<string, any>>()
  const [isPending, startTransition] = useTransition()

  function getProfile() {
    supabase
      .from("profiles")
      .select(PROFILE_STORE_FIELDS)
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => setProfile(data))
  }

  function getFullName() {
    if (!profile) return ""
    if (!profile.first_name && !profile.last_name) return "N/A"
    return `${profile.first_name} ${profile.last_name}`
  }

  function deleteUser() {
    startTransition(() => {
      _deleteUser(user.id).then(({ error }) => {
        if (error) return console.error(error)
        location.reload()
      })
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={getProfile} size="sm">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{user?.email}</DialogTitle>
          <DialogDescription>Joined at {new Date(user?.created_at).toLocaleString()}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 grid-rows-5 grid-flow-row">
          <div>username</div><div>{profile?.username}</div>
          <div>role</div><div>{user.user_metadata.role || "N/A"}</div>
          <div>Full name</div><div>{getFullName()}</div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={deleteUser} disabled={isPending}>Delete</Button>
          <Button disabled={isPending}>Reset Password</Button>
          <Button disabled={isPending || !!user.email_confirmed_at}>Confirm Email</Button>
          <Button disabled={isPending}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export interface SelectedActionsProps<TData> {
  table: Table<TData>
}
function SelectedActions({ table }: SelectedActionsProps<User>) {
  const [isPending, startTransition] = useTransition()

  function deleteSelected() {
    startTransition(() => {
      const ids = table.getSelectedRowModel().rows.map(row => row.original.id)
      deleteMultipleUsers(ids).then(({ error }) => {
        if (error) return console.error(error)
        table.toggleAllRowsSelected(false)
      })
    })
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={deleteSelected}
      disabled={isPending}
    >
      Delete selected
    </Button>
  )
}

interface UserTableProps {
  users: User[]
}
export function UserTable({ users }: UserTableProps) {
  const [count, setCount] = useState<number>()
  const router = useRouter()

  useEffect(() => {
    countUsers().then(({ data }) => setCount(data))
  }, [])

  const pageCount = !!count ? Math.ceil(count / PAGE_SIZE) : 0
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE
  })

  useEffect(() => {
    router.push(`/admin/users?page=${pagination.pageIndex + 1}`)
  }, [pagination, router])

  return (
    <DataTable
      columns={USER_TABLE_COLUMNS}
      data={users}
      pageCount={pageCount}
      manualPagination={!!count}
      onPaginationChange={setPagination}
      state={{ pagination }}
      SelectedActions={SelectedActions}
    />
  )
}
