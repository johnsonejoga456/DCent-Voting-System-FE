"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ElectionForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rules: "",
    startDate: "",
    endDate: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
   setFormData
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Election Created:", formData);
    // TODO: Connnect with the backend API
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6">Create New Election</h2>

      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        {/* Election Title */}
        <div>
          <label className="block mb-2 text-sm">Election Title</label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 text-black rounded border border-gray-300"
            placeholder="Enter election title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 text-sm">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 text-black rounded border border-gray-300"
            placeholder="Enter a brief description"
            rows={4}
          ></textarea>
        </div>

        {/* Rules */}
        <div>
          <label className="block mb-2 text-sm">Rules</label>
          <textarea
            name="rules"
            value={formData.rules}
            onChange={handleChange}
            required
            className="w-full p-2 text-black rounded border border-gray-300"
            placeholder="Specify the rules for this election"
            rows={3}
          ></textarea>
        </div>

        {/* Start Date */}
        <div>
          <label className="block mb-2 text-sm">Start Date</label>
          <Input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full p-2 text-black rounded border border-gray-300"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block mb-2 text-sm">End Date</label>
          <Input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full p-2 text-black rounded border border-gray-300"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full">
            Create Election
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ElectionForm;