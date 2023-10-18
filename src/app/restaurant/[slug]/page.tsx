import { PrismaClient } from "@prisma/client";
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
    },
  });

  if (!restaurant) {
    console.log("error");
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
        <Rating />
        <Description description={restaurant.description} />
        <Imagens images={restaurant.images} />
        <Reviews />
      </div>
      <ReservationCard />
    </>
  );
}
