import React from 'react'

const Steps = [
  'Implement custom naming conventions for form fields',
  'Enhance validation mechanisms for improved accuracy',
  'Allow detailed selection of validation rules within the edit dialog',
  'Open source the project for community contributions',
  'Add sections for request handling and messaging',
  'Create or integrate a Kanban board to visualize the project roadmap',
  'Prepare forms that are ready for easy copying and pasting',
]

export default function RoadMapPage() {
  return (
    <section className="max-w-5xl mx-auto  space-y-8 my-8">
      <div className="space-y-4 ">
        <h1 className="text-3xl font-bold">Roadmap</h1>
        <p className="text-muted-foreground">
          Here are the upcoming steps I plan to take to complete the project:
        </p>

        <div className="divide-y space-y-3">
          {Steps.map((item: string, index: number) => (
            <p className="pt-3" key={index}>
              {index + 1} - {item}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
