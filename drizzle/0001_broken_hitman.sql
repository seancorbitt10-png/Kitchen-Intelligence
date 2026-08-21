CREATE TABLE `analytics_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`eventName` varchar(96) NOT NULL,
	`metadata` text NOT NULL DEFAULT ('{}'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meal_interactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`mealId` int NOT NULL,
	`type` varchar(32) NOT NULL,
	`metadata` text NOT NULL DEFAULT ('{}'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `meal_interactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(220) NOT NULL,
	`description` text NOT NULL,
	`payload` text NOT NULL,
	`source` varchar(32) NOT NULL DEFAULT 'ai',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `meals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pantry_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`canonicalName` varchar(160) NOT NULL,
	`category` varchar(64) NOT NULL,
	`quantity` decimal(10,2) NOT NULL DEFAULT '1',
	`unit` varchar(32) NOT NULL DEFAULT 'item',
	`expirationDate` timestamp,
	`confidence` decimal(4,3) NOT NULL DEFAULT '1',
	`source` varchar(32) NOT NULL DEFAULT 'manual',
	`location` varchar(64) DEFAULT 'pantry',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pantry_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pantry_scans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`imageCount` int NOT NULL DEFAULT 1,
	`status` varchar(32) NOT NULL DEFAULT 'confirmed',
	`candidates` text NOT NULL DEFAULT ('[]'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pantry_scans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shopping_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`quantity` decimal(10,2) NOT NULL DEFAULT '1',
	`unit` varchar(32) NOT NULL DEFAULT 'item',
	`mealTitle` varchar(220),
	`checked` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shopping_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`plan` varchar(32) NOT NULL DEFAULT 'free',
	`status` varchar(32) NOT NULL DEFAULT 'active',
	`providerCustomerId` varchar(160),
	`providerSubscriptionId` varchar(160),
	`currentPeriodEnd` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `usage_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`operation` varchar(64) NOT NULL,
	`provider` varchar(64) NOT NULL,
	`model` varchar(128),
	`inputTokens` int NOT NULL DEFAULT 0,
	`outputTokens` int NOT NULL DEFAULT 0,
	`estimatedCost` decimal(10,6) NOT NULL DEFAULT '0',
	`success` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `usage_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`householdSize` int NOT NULL DEFAULT 2,
	`dietaryPreferences` text NOT NULL DEFAULT ('[]'),
	`allergies` text NOT NULL DEFAULT ('[]'),
	`cuisinePreferences` text NOT NULL DEFAULT ('[]'),
	`dislikes` text NOT NULL DEFAULT ('[]'),
	`skillLevel` varchar(32) NOT NULL DEFAULT 'beginner',
	`cookingTime` varchar(32) NOT NULL DEFAULT '15-30',
	`budget` varchar(32) NOT NULL DEFAULT 'moderate',
	`mealPriorities` text NOT NULL DEFAULT ('[]'),
	`onboardingComplete` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profiles_userId_unique` UNIQUE(`userId`)
);
