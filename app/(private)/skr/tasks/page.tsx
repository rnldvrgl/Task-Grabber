'use client'

import JobList from '@/components/custom/job/job-list'
import SeekerTaskSearchBar from '@/components/custom/seeker-task-search-bar'

export default function SeekerTasksPage() {
  return (
    <section className="space-y-8 container mx-auto flex h-full min-h-screen flex-col px-6 2xl:px-0 max-w-4xl">
      <SeekerTaskSearchBar />
      <JobList />
    </section>
  )
}
