"use client";
import React from 'react';
import TelegramPost from './apps/TelegramPost';
import FacebookPost from './apps/FacebookPost';
import InstagramPost from './apps/InstagramPost';
import PinterestPost from './apps/PinterestPost';

export default function PostEditor() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-900">PostJet Multi-Poster 🚀</h1>
        <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest mt-2">Professional SaaS Dashboard</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TelegramPost />
        <FacebookPost />
        <InstagramPost />
        <PinterestPost />
      </div>

      <footer className="mt-20 text-center border-t pt-8">
        <p className="text-gray-400 text-sm">Developed by Jeevan • Version 2.1.0</p>
      </footer>
    </div>
  );
}