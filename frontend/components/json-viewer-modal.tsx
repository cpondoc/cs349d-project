import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { TelemetryEvent } from "@/lib/types"

interface JsonViewerModalProps {
  event: TelemetryEvent
  isOpen: boolean
  onClose: () => void
}

export function JsonViewerModal({ event, isOpen, onClose }: JsonViewerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="font-mono text-sm">{event.name}</span>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] rounded-md border p-4">
          <pre className="text-xs font-mono">
            {JSON.stringify(event, null, 2)}
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 