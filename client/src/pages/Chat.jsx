"use client";

import {
  CanvasLayer,
  CurrentZoom,
  Page,
  Pages,
  Root,
  TextLayer,
  ZoomIn,
  ZoomOut,
} from "@anaralabs/lector";
import React, { useEffect, useState } from "react";
import "@/lib/setup";
import FileUpload from "../components/kokonutui/file-upload";
import {
  CircularLoader,
  DotsLoader,
  PulseDotLoader,
} from "@/components/ui/loader";
import ChatArea from "../components/ChatArea";
import { useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/client";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import LogoCloud from "@/components/logo-cloud";
import { Navbar5 } from "@/components/navbar5";
import { Navbar6 } from "@/components/navbar6";

const Chat = () => {
  const [fileExist, setFileExist] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const navigate = useNavigate();

  const fileUrl = docUrl;

  useEffect(() => {
    const token = localStorage.getItem("mentex");
    if (!token) {
      navigate("/auth");
    }
  }, [navigate]);

  if (!fileExist) {
    return (
      <>
        <Navbar6 />
        <div className="min-h-screen w-full relative bg-white">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `
        radial-gradient(circle at center 325%, #5493FF, transparent)
      `,
            }}
          />
          <div className="g-font text-[70px] font-extrabold text-center pt-10">
            Research, Supercharged.
          </div>
          <p className="it-font text-center text-[18px]">
            AI-powered research assistant. Faster, accurate answers with
            verified sources. Upload your documents to start.
          </p>
          <div className="w-[500px] mx-auto mt-36 it-font">
            <FileUpload
              fileExist={fileExist}
              setFileExist={setFileExist}
              setDocUrl={setDocUrl}
            />
            <LogoCloud />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen w-full relative bg-white it-font">
        <Navbar5 setFileExist={setFileExist} />
        {/* <div className="w-[62%] h-[39px] bg-[#F3F4F6] fixed top-0 right-0 z-20 flex justify-end items-center pr-4">
    <Button onClick={handleSignOut} variant="outline" size="sm" className="cursor-pointer">
      Logout <LogOutIcon />
    </Button>
  </div> */}

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
        radial-gradient(circle at center 295%, #5493FF, transparent)
      `,
          }}
        />

        <div className="relative flex flex-row">
          <Root
            source={fileUrl}
            className="bg-white rounded-none overflow-hidden relative h-screen w-[990px] flex flex-col justify-stretch"
            loader={
              <div className="pl-72 pt-84">
                <CircularLoader />
              </div>
            }
            zoomOptions={{
              minZoom: 0.1,
              maxZoom: 10,
            }}
          >
            <div className="bg-transparent border-2 p-1 flex items-center justify-center text-sm text-gray-600 gap-2 it-font">
              Adjust Zoom
              <ZoomOut className="px-3 py-1 -mr-2 text-gray-900 cursor-pointer">
                -
              </ZoomOut>
              <CurrentZoom className="bg-white rounded-full px-3 py-1 border text-center w-16" />
              <ZoomIn className="px-3 py-1 -ml-2 text-gray-900 cursor-pointer">
                +
              </ZoomIn>
            </div>
            <Pages className="p-4 h-full">
              <Page>
                <CanvasLayer />
                <TextLayer />
              </Page>
            </Pages>
          </Root>

          <div className="bg-white border-2 rounded-none h-screen flex-shrink-0 w-[529px]">
            <ChatArea />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Chat;
