-- Complete sample database for Community Hope Australia.
CREATE DATABASE IF NOT EXISTS charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE charityevents_db;
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS charity_events;
DROP TABLE IF EXISTS charity_organisations;
DROP TABLE IF EXISTS event_categories;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE event_categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(80) NOT NULL UNIQUE,
  category_description TEXT
);

CREATE TABLE charity_organisations (
  org_id INT AUTO_INCREMENT PRIMARY KEY,
  org_name VARCHAR(120) NOT NULL,
  mission TEXT,
  contact_email VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(30),
  address VARCHAR(200)
);

CREATE TABLE charity_events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  org_id INT NOT NULL,
  category_id INT NOT NULL,
  event_title VARCHAR(150) NOT NULL,
  short_summary VARCHAR(300) NOT NULL,
  full_description TEXT NOT NULL,
  event_start_datetime DATETIME NOT NULL,
  event_end_datetime DATETIME NOT NULL,
  location_name VARCHAR(150) NOT NULL,
  location_suburb VARCHAR(80) NOT NULL,
  ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  charity_funding_goal DECIMAL(12,2) NOT NULL,
  current_funding_raised DECIMAL(12,2) NOT NULL DEFAULT 0,
  event_image_url VARCHAR(255),
  is_suspended TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_event_org FOREIGN KEY (org_id) REFERENCES charity_organisations(org_id),
  CONSTRAINT fk_event_category FOREIGN KEY (category_id) REFERENCES event_categories(category_id),
  CONSTRAINT chk_event_dates CHECK (event_end_datetime >= event_start_datetime)
);

INSERT INTO event_categories (category_id, category_name, category_description) VALUES
(1,'Fun Run / Community Walk','Active community fundraising events.'),
(2,'Gala Dinner','Evening fundraising dinners.'),
(3,'Silent Auction','Auctions supporting local programs.'),
(4,'Charity Concert','Live music for a good cause.'),
(5,'Community Fair','Family friendly local fairs.');

INSERT INTO charity_organisations (org_id, org_name, mission, contact_email, contact_phone, address) VALUES
(1,'Community Hope Australia','Support local vulnerable families, homeless youth and community wellbeing by organising fundraising charity events across Australian cities. All funds raised go directly to community support programs.','contact@communityhope.org.au','+61 7 5550 1234','123 Community Lane, Brisbane QLD 4000 Australia');

INSERT INTO charity_events (event_id,org_id,category_id,event_title,short_summary,full_description,event_start_datetime,event_end_datetime,location_name,location_suburb,ticket_price,charity_funding_goal,current_funding_raised,event_image_url,is_suspended) VALUES
(1,1,1,'Brisbane River Hope Run','Run or walk together to support families in need.','Join neighbours along the river for a welcoming 5 km community run and walk. Every registration supports local families.','2026-10-18 08:00:00','2026-10-18 12:00:00','South Bank Parklands','South Brisbane',15.00,12000,7350,'https://images.squarespace-cdn.com/content/v1/654e704cc6cddc14a0d2def6/a3085a61-846e-40df-bfba-2b1657e17bbe/CFN2025-34.jpg',0),
(2,1,2,'Hope in Bloom Gala','An evening of food, stories and community giving.','Enjoy a community dinner and hear how local programs are creating safer futures for young people.','2026-11-07 18:00:00','2026-11-07 22:00:00','The Old Museum','Bowen Hills',85.00,30000,18400,'https://images.squarespace-cdn.com/content/v1/68dae3f7ec6e03621e8776ee/3847de0b-bff1-490c-b7fe-3690c1dc043f/SCHOOLFORLIFE2025_-208.jpg',0),
(3,1,4,'Songs for Shelter','Live music raising funds for youth housing support.','Local musicians come together for an all ages concert. Proceeds help young people access safe accommodation.','2026-11-22 16:00:00','2026-11-22 20:00:00','The Tivoli','Fortitude Valley',25.00,18000,9100,'https://www.hcdestinations.com/galleria_photos/VisitJoliet/bipark.jpg',0),
(4,1,5,'Neighbourhood Giving Fair','Discover local makers, food and family activities.','Meet community groups and local makers at a free day of food stalls, activities and music.','2026-12-05 09:00:00','2026-12-05 15:00:00','New Farm Park','New Farm',0,8000,2200,'https://images.squarespace-cdn.com/content/v1/6774103ffdb3b9511c3da705/ed6e017b-5342-424d-bc1c-7152af390a35/P1079337.JPG?format=1500w',0),
(5,1,3,'Community Champions Auction','Bid on local experiences and support community programs.','Browse donated art, experiences and goods in our online and in-person silent auction evening.','2027-01-16 17:00:00','2027-01-16 21:00:00','Brisbane Powerhouse','New Farm',10.00,22000,12600,'https://images.luxgive.com/844/live-auction-items-fundraising-events.jpg',0),
(6,1,1,'Sunshine Coast Together Walk','A relaxed coastal walk for a stronger community.','Bring friends and family for a scenic community walk supporting wellbeing programs.','2026-08-09 07:30:00','2026-08-09 10:30:00','Cotton Tree Park','Maroochydore',0,9000,9000,'https://cdn.b12.io/client_media/o5NgXtiy/d84aef20-f49b-11ea-a8a2-0242ac110002-jpeg-regular_image.jpeg',0),
(7,1,4,'Voices of Hope','A past concert celebrating local community choirs.','Community choirs shared an uplifting afternoon of music to raise funds for family support services.','2025-11-15 14:00:00','2025-11-15 17:00:00','Brisbane City Hall','Brisbane City',20.00,10000,11250,'https://www.manchesterct.gov/files/assets/public/v/1/leisure-family-and-recreation/parks-images/center_memorial_header.jpg?w=1080',0),
(8,1,5,'West End Spring Fair','A past spring fair bringing neighbours together.','Families enjoyed local food and activities while supporting community wellbeing programs.','2025-09-20 10:00:00','2025-09-20 16:00:00','Davies Park','West End',0,7000,7650,'https://images.squarespace-cdn.com/content/v1/5fbd06b5be7cfc36344f5239/967cb328-df73-4ad3-b717-37a4f6e03144/0L9A3117.jpeg?format=1500w',0),
(9,1,2,'Suspended Test Dinner','This event should never appear in public listings.','Seed record used to confirm that suspended events are filtered by the API.','2026-12-12 18:00:00','2026-12-12 21:00:00','Private venue','Brisbane City',50.00,5000,0,NULL,1);

INSERT INTO charity_events (event_id,org_id,category_id,event_title,short_summary,full_description,event_start_datetime,event_end_datetime,location_name,location_suburb,ticket_price,charity_funding_goal,current_funding_raised,event_image_url,is_suspended) VALUES
(10,1,1,'The Neighbourhood Mile','Take a cheerful one-mile stroll and make a difference close to home.','A relaxed, all-ages walk along the river with local volunteers, refreshments and a shared goal of supporting families across Brisbane.','2026-10-24 08:30:00','2026-10-24 11:30:00','Riverside Green','Kangaroo Point',0,6500,1850,'https://patch.com/img/cdn20/users/22893546/20190325/052540/styles/raw/public/processed_images/20190323-funrunwellnessfair-115-2-1553548958-5800.jpg',0),
(11,1,2,'Light Up the Table Gala','Gather for a generous evening celebrating community care.','Share a seasonal dinner, meet local program partners and hear stories of young people finding support and a safe place to belong.','2026-11-14 18:30:00','2026-11-14 22:00:00','River Room','Brisbane City',95.00,36000,21600,'https://eventsorg.s3.us-west-2.amazonaws.com/EventImages/d5a9ca5f-1cf2-4a12-8504-24224acf7d48/550533a2-f438-4df9-a792-748593eba668/gallery/_MD16547.jpg',0),
(12,1,3,'Second Chance Silent Auction','Discover one-of-a-kind local finds and give them a second life.','Browse donated artwork, dining experiences and handmade pieces in a friendly auction supporting practical help for local families.','2026-12-03 17:30:00','2026-12-03 20:30:00','The Foundry','West End',12.00,17500,8200,'https://e9jn6jeo54q.exactdn.com/app/uploads/2024/05/MasArt_Auction23-232-scaled.jpg?strip=all',0),
(13,1,4,'Harmony in the Park','Bring a picnic and enjoy an afternoon of live local music.','Brisbane performers and community choirs share an open-air concert raising funds for wellbeing and youth support programs.','2026-12-19 15:00:00','2026-12-19 19:00:00','Roma Street Parkland','Brisbane City',18.00,14000,6700,'https://arc.stimg.co/startribunemedia/CSKPHNGUI5B5VAHSK42KND7SKU.jpg?ar=1.91%3A1&fit=crop&w=1200',0),
(14,1,5,'Neighbourhood Harvest Fair','Meet makers, taste local treats and enjoy a day together.','A family-friendly fair with community stalls, food and hands-on activities. Entry is free and donations support local community programs.','2027-01-30 09:30:00','2027-01-30 15:30:00','Orleigh Park','West End',0,9200,3100,'https://assets.atdw-online.com.au/images/c2c680f1f1b9aff22865c256e8600b0e.jpeg?rect=558%2C1%2C2048%2C1536&rot=360&w=1200',0),
(15,1,1,'Toowoomba Sunrise Walk','A past sunrise walk that brought neighbours together.','Walkers followed a gentle garden route and raised funds for local family support and youth wellbeing services.','2026-09-05 07:00:00','2026-09-05 10:00:00','Queens Park','Toowoomba',10.00,5800,6420,'https://www.greenflagaward.org/media/1443/valentines-2.jpg',0),
(16,1,2,'Lanterns of Hope Dinner','A past community dinner celebrating acts of kindness.','Guests shared a warm meal and heard from volunteers supporting young people and families across the Logan community.','2026-06-13 18:00:00','2026-06-13 21:30:00','The Lantern Hall','Logan Central',55.00,16000,17350,'https://images.squarespace-cdn.com/content/v1/65b6a1219cd102591a6f93eb/1731365274443-YSQ1KII9IYQH7ZR2CNZT/A4206234-DBB8-4450-A1DD-CE57EA5596D3.JPG?format=1500w',0),
(17,1,3,'Stories That Stay Auction','Bid on meaningful experiences donated by local supporters.','From a weekend escape to a handmade keepsake, every winning bid helps fund community care and youth support.','2027-02-18 18:00:00','2027-02-18 21:00:00','The Old Flour Mill','Newstead',20.00,24000,10400,'https://images.squarespace-cdn.com/content/v1/5eb5fdd5d2ae880e0fdf959f/2c9b51c9-2952-4710-af86-8001d0e4b247/KJoyPhoto_ArtSpan2024_28279-Enhanced-NR%2Bcopy.jpg?format=1500w',0),
(18,1,4,'Songs by the Sea','A sunset concert with local bands and a coastal view.','Enjoy an evening of live music by the water, with proceeds supporting community wellbeing initiatives on the coast.','2027-03-20 16:30:00','2027-03-20 20:30:00','Broadwater Lawn','Southport',28.00,21000,12500,'https://storage.flyo.cloud/4_91f50c96_summersprosse-2022-1.jpg',0),
(19,1,5,'Small Acts Market','Shop local and connect with the people behind the stalls.','Local makers, community organisations and food vendors come together for a bright day of discovery and giving.','2027-04-17 10:00:00','2027-04-17 16:00:00','Victoria Gardens','East Perth',0,11500,5200,'https://images.squarespace-cdn.com/content/v1/66a040b179abde0c083ecadf/d31554a7-cbb9-45e8-b04d-aced5289c206/stones%2Btouch%2Bfarmers%2Bmarket.jpeg?format=1500w',0),
(20,1,1,'Adelaide Steps Together','Choose your pace for a welcoming city-to-park walk.','A community walk for all ages. Bring a friend, meet new neighbours and help fund support services for families and young people.','2027-05-16 08:00:00','2027-05-16 11:30:00','River Torrens Linear Park','Adelaide',12.00,13000,6400,'https://images.squarespace-cdn.com/content/v1/5f7b92995e1c40080067d887/157224a4-cfff-43ab-ab6f-327074e5a079/IMG_9697.jpeg?format=1500w',0),
(21,1,2,'Hobart Kindness Gala','Celebrate generosity with a dinner overlooking the harbour.','An evening gathering for community supporters, with local food and stories about the impact of accessible support programs.','2027-06-26 18:00:00','2027-06-26 22:00:00','Harbour View House','Hobart',78.00,28000,13600,'https://www.acs.sch.ae/sites/default/files/2025-05/54522135337_82f3c062f5_k.jpg',0);
