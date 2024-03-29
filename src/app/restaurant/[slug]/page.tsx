import { PrismaClient, Review } from "@prisma/client";
import { notFound } from "next/navigation";
import Description from "./components/Description";
import Imagens from "./components/Imagens";
import Rating from "./components/Rating";
import ReservationCard from "./components/ReservationCard";
import RestaurantNavbar from "./components/RestaurantNavBar";
import Reviews from "./components/Reviews";
import Title from "./components/Title";

const prisma = new PrismaClient();

interface Restaurant {
  id: number;
  name: string;
  images: string[];
  description: string;
  slug: string;
  reviews: Review[];
  open_time: string;
  close_time: string;
}

const fetchRestaurant = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
      reviews: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    notFound();
  }

  return restaurant;
};

export default async function Restaurant({
  params,
}: {
  params: { slug: string };
}) {
  const restaurant = await fetchRestaurant(params.slug);
  console.log(restaurant);
  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavbar slug={restaurant.slug} />
        <Title name={restaurant.name} />
        <Rating reviews={restaurant.reviews} />
        <Description description={restaurant.description} />
        <Imagens images={restaurant.images} />
        <Reviews reviews={restaurant.reviews} />
      </div>
      <ReservationCard
        openTime={restaurant.open_time}
        closeTime={restaurant.close_time}
        slug={restaurant.slug}
      />
    </>
  );
}
