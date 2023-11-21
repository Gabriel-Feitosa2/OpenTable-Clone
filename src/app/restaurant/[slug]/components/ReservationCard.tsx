"use client";
import { partySize as partySizes, times } from "../../../../../data";
import DatePicker from "react-datepicker";
import { useState } from "react";
import useAvailabilities from "../../../../hooks/useAvailabilities";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { convertToDisplayTime } from "../../../../../utils/convertToDisplayTime";

export default function ReservationCard({
  openTime,
  closeTime,
  slug,
}: {
  openTime: string;
  closeTime: string;
  slug: string;
}) {
  const { data, error, fetchAvailabilities, loading } = useAvailabilities();
  const [selectDate, setSelectDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState(openTime);
  const [partySize, setPartySize] = useState("2");
  const [day, setDay] = useState(new Date().toISOString().split("T")[0]);

  console.log(data);

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split("T")[0]);
      return setSelectDate(date);
    } else {
      return setSelectDate(null);
    }
  };

  const handleClick = () => {
    fetchAvailabilities({ slug, day, time, partySize });
  };

  const filterTimeByRestaurantOpenWindow = () => {
    const timesWithInWidow: typeof times = [];

    let isWithWindow = false;

    times.forEach((time) => {
      if (time.time === openTime) {
        isWithWindow = true;
      }
      if (isWithWindow) {
        timesWithInWidow.push(time);
      }
      if (time.time === closeTime) {
        isWithWindow = false;
      }
    });

    return timesWithInWidow;
  };

  return (
    <div className="w-[27%] relative text-reg">
      <div className="w-[15%] min-w-fit bg-white rounded p-3 shadow">
        <div className="text-center border-b pb-2 font-bold">
          <h4 className="mr-7 text-lg">Make a Reservation</h4>
        </div>
        <div className="my-3 flex flex-col">
          <label htmlFor="">Party size</label>
          <select
            name=""
            className="py-3 border-b font-light"
            id=""
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
          >
            {partySizes.map((size) => (
              <option value={size?.value}>{size?.label}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col w-[48%]">
            <label htmlFor="">Date</label>
            <DatePicker
              selected={selectDate}
              onChange={handleChangeDate}
              className="py-3 border-b font-light text-reg w-24"
              dateFormat="MMMM d"
              wrapperClassName="w-[48%]"
            />
          </div>
          <div className="flex flex-col w-[48%]">
            <label htmlFor="">Time</label>
            <select
              name=""
              id=""
              className="py-3 border-b font-light"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {filterTimeByRestaurantOpenWindow().map((time) => (
                <option value={time.time}>{time.displayTime}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-5">
          <button
            className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? <CircularProgress color="inherit" /> : "Find a Time"}
          </button>
        </div>
        {data ? (
          <div className="mt-4">
            <p className="text-reg">Select a Time</p>
            <div className="flex flex-wrap mt-2">
              {data.map((time) => {
                return time.available ? (
                  <Link
                    href={`/reserve/${slug}date=${day}T${time.time}&partySize=${partySize}`}
                    className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
                  >
                    <p className="text-sm font-bold">
                      {convertToDisplayTime(time.time)}
                    </p>
                  </Link>
                ) : (
                  <p className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3"></p>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
