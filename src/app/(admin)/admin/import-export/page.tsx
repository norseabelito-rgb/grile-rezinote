import { getChaptersForSelect } from "@/lib/actions/questions"
import { ImportUpload } from "@/components/admin/import-upload"
import { ExportControls } from "@/components/admin/export-controls"
import { Separator } from "@/components/ui/separator"

export default async function ImportExportPage() {
  const chapters = await getChaptersForSelect()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Import / Export</h1>
        <p className="mt-1 text-muted-foreground">
          Importa sau exporta intrebari in format CSV si Excel.
        </p>
      </div>

      <div className="space-y-10">
        {/* Import section */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Import intrebari</h2>
          <ImportUpload />
        </section>

        <Separator />

        {/* Export section */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Export intrebari</h2>
          <ExportControls chapters={chapters} />
        </section>
      </div>
    </div>
  )
}
