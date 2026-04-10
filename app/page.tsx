/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { createGenerateMetadata } from "@lib/pageUtils";
import { HomeClient } from "./HomeClient";

export const generateMetadata = createGenerateMetadata("home");

export default function Home() {
  return <HomeClient />;
}
