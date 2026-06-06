import { useState, useEffect } from "react";
import {
  Power,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  ArrowLeft,
  Volume2,
  Volume1,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { requestGetServer } from "./requests";

type DecoderStatusResponse = {
  statusCode: number;
  result?: {
    data?: {
      activeStandbyState?: number | string;
    };
  };
};

const readPowerState = (response?: DecoderStatusResponse) => {
  const activeStandbyState = response?.result?.data?.activeStandbyState;
  if (activeStandbyState === undefined) return undefined;

  return activeStandbyState.toString() === "0";
};

export function TvRemote() {
  const [power, setPower] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | undefined>();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tvState"],
    queryFn: async () => await requestGetServer<DecoderStatusResponse>("/status"),
    refetchOnWindowFocus: true,
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (isLoading || error || !data) return;
    const isOn = readPowerState(data);
    if (isOn !== undefined) {
      setPower(isOn);
      if (isOn) {
        setStatusMessage(undefined);
      }
    }
  }, [data, isLoading, error]);

  const handlePower = async () => {
    setStatusMessage(undefined);
    const response = await requestGetServer<DecoderStatusResponse>("/power");
    const isOn = readPowerState(response);
    if (isOn !== undefined) {
      setPower(isOn);
      if (!isOn) {
        setStatusMessage("Decoder accepted the command but stayed in standby.");
      }
    }
    await queryClient.refetchQueries({ queryKey: ["tvState"] });
  };

  const handleVolumeUp = async () => {
    await requestGetServer("/cmd/115");
  };

  const handleVolumeDown = async () => {
    await requestGetServer("/cmd/114");
  };

  const handleChannelUp = async () => {
    await requestGetServer("/cmd/403");
  };

  const handleChannelDown = async () => {
    await requestGetServer("/cmd/402");
  };

  const handleNumberPress = async (num: number) => {
    await requestGetServer(`/cmd/${512 + num}`);
  };

  const handleHomePress = async () => {
    await requestGetServer("/cmd/139");
  };

  const handleBackPress = async () => {
    await requestGetServer("/cmd/158");
  };

  const handleDirection = async (
    direction: "up" | "down" | "right" | "left",
  ) => {
    switch (direction) {
      case "up":
        return await requestGetServer("/cmd/103");
      case "down":
        return await requestGetServer("/cmd/108");
      case "right":
        return await requestGetServer("/cmd/106");
      case "left":
        return await requestGetServer("/cmd/105");
    }
  };

  const handleOkPress = async () => {
    await requestGetServer("/cmd/352");
  }

  return (
    <div className="relative w-full max-w-xs mx-auto">
      <div
        className={cn(
          "relative bg-black rounded-3xl",
          "transition-all duration-300",
          power ? "shadow-white/20" : "",
        )}
      >
        {/* Top Section with Power and Navigation Controls */}
        {/* Power Button */}
        <div className="flex flex-row items-center gap-3 pb-4">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full border-2",
              power
                ? "bg-red-600 text-white border-red-600 hover:bg-black"
                : "border-white text-white hover:text-red-600 hover:border-red-600 hover:bg-black",
            )}
            onClick={handlePower}
          >
            <Power className="h-5 w-5" />
          </Button>
          <h1 className="text-neutral-400 text-xs text-center">Power</h1>
        </div>
        {statusMessage && (
          <p className="mb-4 text-xs leading-4 text-red-300">{statusMessage}</p>
        )}

        {/* Navigation Controls - Rotated Circular Pad */}
        <div className="relative h-48 w-48 mx-auto mb-6">
          {/* Circular Container */}
          <div
            className={`absolute inset-0 rounded-full border-2 ${!power ? "border-white/50" : "border-white"} overflow-hidden`}
          >
            {/* Rotated Container */}
            <div className="absolute inset-0 rotate-45">
              {/* Up Button - Top-Right Quadrant */}
              <button
                className={cn(
                  "absolute top-0 left-0 w-1/2 h-1/2 -translate-x-[1px] -translate-y-[1px] border-r border-b border-white disabled:border-white/50 disabled:cursor-default",
                  "enabled:hover:bg-white/10 active:bg-white/20 transition-colors",
                  "flex items-center justify-center",
                  !power && "opacity-50 cursor-not-allowed",
                )}
                disabled={!power}
                onClick={async () => await handleDirection("up")}
              >
                <div className="-rotate-45 flex items-center justify-center">
                  <ChevronUp className="h-6 w-6 text-white" />
                </div>
              </button>

              {/* Right Button - Bottom-Right Quadrant */}
              <button
                className={cn(
                  "absolute top-0 right-0 w-1/2 h-1/2 translate-x-[1px] -translate-y-[1px] border-l border-b border-white disabled:border-white/50 disabled:cursor-default",
                  "enabled:hover:bg-white/10 active:bg-white/20 transition-colors",
                  "flex items-center justify-center",
                  !power && "opacity-50 cursor-not-allowed",
                )}
                disabled={!power}
                onClick={async () => await handleDirection("right")}
              >
                <div className="-rotate-45 flex items-center justify-center">
                  <ChevronRight className="h-6 w-6 text-white" />
                </div>
              </button>

              {/* Down Button - Bottom-Left Quadrant */}
              <button
                className={cn(
                  "absolute bottom-0 right-0 w-1/2 h-1/2 translate-x-[1px] translate-y-[1px] border-l border-t border-white enabled:disabled:border-white/50 disabled:cursor-default",
                  "enabled:hover:bg-white/10 enabled:active:bg-white/20 transition-colors",
                  "flex items-center justify-center",
                  !power && "opacity-50 cursor-not-allowed",
                )}
                disabled={!power}
                onClick={async () => await handleDirection("down")}
              >
                <div className="-rotate-45 flex items-center justify-center">
                  <ChevronDown className="h-6 w-6 text-white" />
                </div>
              </button>

              {/* Left Button - Top-Left Quadrant */}
              <button
                className={cn(
                  "absolute bottom-0 left-0 w-1/2 h-1/2 -translate-x-[1px] translate-y-[1px] border-r border-t border-white disabled:border-white/50 disabled:cursor-default",
                  "enabled:hover:bg-white/10 active:bg-white/20 transition-colors",
                  "flex items-center justify-center",
                  !power && "opacity-50 cursor-not-allowed",
                )}
                disabled={!power}
                onClick={async () => await handleDirection("left")}
              >
                <div className="-rotate-45 flex items-center justify-center">
                  <ChevronLeft className="h-6 w-6 text-white" />
                </div>
              </button>
            </div>
          </div>

          {/* OK Button - Center */}
          <Button
            variant="outline"
            className="bg-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white text-white hover:bg-orange-500 font-bold h-16 w-16 z-50 disabled:opacity-100 disabled:border-white/50 disabled:text-white/50"
            disabled={!power}
            onClick={handleOkPress}
          >
            OK
          </Button>
        </div>

        {/* Home and Back Buttons */}
        <h1 className="text-neutral-400 text-xs text-center pb-1">
          Navigation
        </h1>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant="outline"
            className="border-white text-white hover:bg-orange-500 rounded-2xl"
            disabled={!power}
            onClick={async () => await handleHomePress()}
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white/10 rounded-2xl"
            disabled={!power}
            onClick={async () => await handleBackPress()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Number Buttons */}
        <h1 className="text-neutral-400 text-xs text-center pb-1">Numbers</h1>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="outline"
              className="border-white text-white hover:bg-white/10 font-bold"
              disabled={!power}
              onClick={async () => await handleNumberPress(num)}
            >
              {num}
            </Button>
          ))}
          <div className="col-start-2">
            <Button
              variant="outline"
              className="w-full border-white text-white hover:bg-white/10 font-bold"
              disabled={!power}
              onClick={async () => await handleNumberPress(0)}
            >
              0
            </Button>
          </div>
        </div>

        {/* Volume and Channel Controls */}
        <div className="grid grid-rows-2 gap-4 pb-4">
          <div>
            <h1 className="text-neutral-400 text-xs text-center pb-1">
              Volume
            </h1>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="w-full border-white text-white hover:bg-white/10"
                disabled={!power}
                onClick={handleVolumeDown}
              >
                <Volume1 className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="w-full border-white text-white hover:bg-white/10"
                disabled={!power}
                onClick={handleVolumeUp}
              >
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h1 className="text-neutral-400 text-xs text-center pb-1">
              Channels
            </h1>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="w-full border-white text-white hover:bg-white/10"
                disabled={!power}
                onClick={handleChannelDown}
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="w-full border-white text-white hover:bg-white/10"
                disabled={!power}
                onClick={handleChannelUp}
              >
                <ChevronUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Brand Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-neutral-400 text-xs">
          Laurent Made
        </div>
      </div>
    </div>
  );
}
