import { useState } from "react";
import { Button } from "@/components/ui/button";

const SelectTime = (props) => {
  const { availableTimes, onTimeSelect } = props;
  const [selectedTime, setSelectedTime] = useState("");

  const handleSelectTime = (time) => {
    setSelectedTime(time);
    onTimeSelect(time);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {availableTimes.map((time) => (
        <Button
          key={time}
          variant={selectedTime === time ? "default" : "outline"}
          className={`w-20 py-2 border-2 rounded-lg ${selectedTime === time ? "bg-[#159030] hover:bg-green-700 text-white" : "border-gray-300"}`}
          onClick={() => handleSelectTime(time)}
        >
          {time}
        </Button>
      ))}
    </div>
  );
};

export default SelectTime;
