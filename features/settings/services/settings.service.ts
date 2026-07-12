import { prisma } from "@/lib/prisma";

export class SettingsService {
  async getSettings() {
    const settings = await prisma.storeSettings.findMany();
    const settingsMap: Record<string, string> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }
    return settingsMap;
  }

  async getSetting(key: string) {
    const setting = await prisma.storeSettings.findUnique({ where: { key } });
    return setting?.value;
  }

  async updateSettings(data: Record<string, string>) {
    const updates = Object.entries(data).map(([key, value]) =>
      prisma.storeSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );
    await Promise.all(updates);
  }
}

export const settingsService = new SettingsService();
