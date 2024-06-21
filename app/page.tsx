"use client";

import AboutAccordion from "../components/AboutAccordion";
import Kesko from "../components/Kesko";
import SKaupat from "../components/SKaupat";
import GroceryList from "../components/GroceryList";
import NavBar from "../components/NavBar";
import { useState, useEffect, FormEvent } from "react";
import { Scraper } from "./scraper";

export interface Item {
  id: string;
  title: string;
}

export type ProductData = Record<string, [string, string, string]>;

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  const addItem = (newItem: string, e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (newItem.trim() === "") {
      alert("Please enter an item!");
      return Promise.resolve();
    }
    console.log("GOT NEW ITEM", newItem);
    return new Promise((resolve) => {
      setItems((currentItems) => {
        const updatedItems = [
          ...(currentItems || []),
          { id: crypto.randomUUID(), title: newItem },
        ];
        resolve();
        return updatedItems;
      });
    });
  };

  const deleteItem = (id: string) => {
    setItems((currentItems) => {
      return (currentItems || []).filter((item) => item.id !== id);
    });
  };

  const [finalSKaupat, setFinalSKaupat] = useState<
    Record<string, [string, string, string]>
  >({});
  const [finalKesko, setFinalKesko] = useState<
    Record<string, [string, string, string]>
  >({});
  const [loading, setLoading] = useState(false);
  const [itemsSentToServer, setItemsSentToServer] = useState(0);

  const sendAllItems = async (itemsToSend: Item[]) => {
    setLoading(true);
    setItemsSentToServer(itemsToSend.length);

    try {
      // Send items to server
      console.log("Sending data to the scraper:", itemsToSend);
      let scrapedItems: { skaupat: ProductData; kesko: ProductData };
      scrapedItems = await Scraper(itemsToSend);
      setFinalSKaupat(scrapedItems.skaupat);
      setFinalKesko(scrapedItems.kesko);
      setLoading(false);
      ``;
    } catch (error) {
      console.log("Error sending items to server:", error);
    }
  };

  return (
    <div className="App max-w-[1024px] mx-auto px-4 pb-20 flex flex-col">
      <NavBar />
      <div className="w-full grid md:grid-cols-2 flex-grow">
        <GroceryList
          items={items}
          addItem={addItem}
          deleteItem={deleteItem}
          sendAllItems={sendAllItems}
          loading={loading}
        />

        {loading ? (
          // Skeleton
          <div>
            <div
              role="status"
              className="space-y-2 bg-secondary md:ml-8 mt-8 md:mt-0 rounded-2xl h-auto animate-pulse p-2 "
            >
              {Array.from({ length: itemsSentToServer }, (_, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg flex items-center bg-card-item"
                >
                  <div className="h-12 bg-white rounded-md mr-4 w-12"></div>
                  <div className="h-4 bg-secondary rounded-full w-24"></div>
                  <div className="ml-auto h-6 bg-secondary rounded-xl w-16 mr-2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : Object.keys(finalSKaupat).length > 0 &&
          Object.keys(finalKesko).length > 0 ? (
          <div className="md:pl-8 pl-0 mt-4">
            <Kesko className={"mb-8"} finalProducts={finalKesko} />
            <SKaupat finalProducts={finalSKaupat} />
          </div>
        ) : Object.keys(finalSKaupat).length === 0 &&
          Object.keys(finalKesko).length > 0 ? (
          <div className="md:pl-8 pl-0 mt-8">
            <Kesko finalProducts={finalKesko} />
            <SKaupat finalProducts={finalSKaupat} />
          </div>
        ) : Object.keys(finalKesko).length === 0 &&
          Object.keys(finalSKaupat).length > 0 ? (
          <div className="md:pl-8 pl-0">
            <SKaupat finalProducts={finalSKaupat} />
            <Kesko finalProducts={finalKesko} />
          </div>
        ) : (
          <p className="font-medium text-center text-gray-600 mt-16">
            The result will be here...
          </p>
        )}
      </div>

      {/* About Section */}
      <footer className="mt-[260px]">
        <h3 className="font-bold mb-4">About Ruokascraper</h3>
        <hr />
        <AboutAccordion
          title={"What is it?"}
          text={
            <div>
              Ruokascraper saves you time and money on groceries. It creates
              separate grocery lists for store chains and shows only the
              cheapest options to help you save money on your groceries.
              <br />
              To use Ruokascraper just write the products you need to buy in the
              grocery list above (only in Finnish) and press "Make the list!"
              button. You will be presented with two lists each representing a
              store chain with the cheapest alternatives to the items in your
              grocery list.
            </div>
          }
        />
        <hr />
        <AboutAccordion
          title={"How is it built"}
          text={
            <div>
              Ruokascraper is a React App built with Tailwind for styling and
              Express.js for the server-side. The product data is scraped from{" "}
              <a href="https://www.k-ruoka.fi/">K-Ruoka </a>
              and <a href="https://www.s-kaupat.fi/">S-Kaupat</a> websites and
              then processed on the server side.
              <br />
              You can check out the source code{" "}
              <a href="https://github.com/filoooooonov/ruoka-scraper">here </a>
              and the author's portfolio{" "}
              <a href="https://filoooooonov.github.io/">here</a>.
            </div>
          }
        />
      </footer>
    </div>
  );
}
