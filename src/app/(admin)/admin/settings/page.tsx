import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExamSettingsForm } from "@/components/admin/ExamSettingsForm"
import { getExamSettings } from "@/lib/actions/admin-settings"

export default async function SettingsPage() {
  const settings = await getExamSettings()

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Setari Platforma</h1>
        <p className="text-muted-foreground">
          Configureaza parametrii platformei
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Simulare Examen</CardTitle>
        </CardHeader>
        <CardContent>
          <ExamSettingsForm
            currentDurationSeconds={settings.durationSeconds}
          />
        </CardContent>
      </Card>
    </div>
  )
}
