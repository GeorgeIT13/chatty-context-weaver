
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChatSettings {
  context: string;
  role: string;
  constraints: string;
  apiKey: string;
  model: string;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
}

export function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }: SettingsPanelProps) {
  const handleChange = (field: keyof ChatSettings, value: string) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-white border-r shadow-lg flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Settings</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="apiKey">OpenAI API Key</Label>
          <Input
            id="apiKey"
            type="password"
            value={settings.apiKey}
            onChange={(e) => handleChange("apiKey", e.target.value)}
            placeholder="sk-..."
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500">
            Your API key is stored locally and never sent to our servers.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select value={settings.model} onValueChange={(value) => handleChange("model", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="context">Context</Label>
          <Textarea
            id="context"
            value={settings.context}
            onChange={(e) => handleChange("context", e.target.value)}
            placeholder="You are a helpful AI assistant..."
            rows={3}
          />
          <p className="text-xs text-gray-500">
            Set the overall context and personality of the AI.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={settings.role}
            onChange={(e) => handleChange("role", e.target.value)}
            placeholder="assistant"
          />
          <p className="text-xs text-gray-500">
            Define the specific role the AI should play.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="constraints">Constraints</Label>
          <Textarea
            id="constraints"
            value={settings.constraints}
            onChange={(e) => handleChange("constraints", e.target.value)}
            placeholder="Be helpful, harmless, and honest..."
            rows={3}
          />
          <p className="text-xs text-gray-500">
            Set boundaries and guidelines for the AI's responses.
          </p>
        </div>
      </div>
    </div>
  );
}
