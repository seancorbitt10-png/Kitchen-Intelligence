ALTER TABLE `analytics_events` MODIFY COLUMN `metadata` text NOT NULL;--> statement-breakpoint
ALTER TABLE `meal_interactions` MODIFY COLUMN `metadata` text NOT NULL;--> statement-breakpoint
ALTER TABLE `pantry_scans` MODIFY COLUMN `candidates` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user_profiles` MODIFY COLUMN `dietaryPreferences` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user_profiles` MODIFY COLUMN `allergies` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user_profiles` MODIFY COLUMN `cuisinePreferences` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user_profiles` MODIFY COLUMN `dislikes` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user_profiles` MODIFY COLUMN `mealPriorities` text NOT NULL;