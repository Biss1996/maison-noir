import { useEffect, useState } from "react";

import {
  DEFAULT_SETTINGS,
  getSettings,
} from "../services/settingsService";

export default function useSettings() {
  const [settings, setSettings] = useState(
    DEFAULT_SETTINGS
  );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe = getSettings(
      (data) => {
        setSettings(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return {
    settings,
    loading,
  };
}