// Layout component to display both components side by side
import React from "react";
import LatestItems from "./LatestItems";
import TopDeals from "./TopDeals";

export default function DealsAndLatestLayout() {
    return (
        <div className="max-w-7xl mx-auto mt-8 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left side - Latest Items */}
                <div className="w-full">
                    <LatestItems />
                </div>

                {/* Right side - Top Deals */}
                <div className="w-full">
                    <TopDeals />
                </div>
            </div>
        </div>
    );
}