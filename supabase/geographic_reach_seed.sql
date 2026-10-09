-- OBSOLETE: Do not run after migrations/012_drop_geographic_reach.sql.
-- Historical seed for CMS-managed geographic reach (table removed from the app).
-- Originally: run after supabase/migrations/008_geographic_reach.sql.

insert into public.geographic_reach (country_name, iso_alpha3, latitude, longitude, display_order, status, published_at)
values
  ('Afghanistan', 'AFG', 33.9391, 67.71, 1, 'published', now()),
  ('Albania', 'ALB', 41.1533, 20.1683, 2, 'published', now()),
  ('Brazil', 'BRA', -14.235, -51.9253, 3, 'published', now()),
  ('Burkina Faso', 'BFA', 12.2383, -1.5616, 4, 'published', now()),
  ('China', 'CHN', 35.8617, 104.1954, 5, 'published', now()),
  ('Chuuk', 'FSM', 7.4256, 151.7835, 6, 'published', now()),
  ('Cook Islands', 'COK', -21.2367, -159.7777, 7, 'published', now()),
  ('Côte d''Ivoire', 'CIV', 7.54, -5.5471, 8, 'published', now()),
  ('DRC', 'COD', -4.0383, 21.7587, 9, 'published', now()),
  ('Ecuador', 'ECU', -1.8312, -78.1834, 10, 'published', now()),
  ('Ethiopia', 'ETH', 9.145, 40.4897, 11, 'published', now()),
  ('Federated States of Micronesia', 'FSM', 7.4256, 150.5508, 12, 'published', now()),
  ('Fiji', 'FJI', -17.7134, 178.065, 13, 'published', now()),
  ('France', 'FRA', 46.2276, 2.2137, 14, 'published', now()),
  ('Ghana', 'GHA', 7.9465, -1.0232, 15, 'published', now()),
  ('Guatemala', 'GTM', 15.7835, -90.2308, 16, 'published', now()),
  ('Guinea', 'GIN', 9.9456, -9.6966, 17, 'published', now()),
  ('Kazakhstan', 'KAZ', 48.0196, 66.9237, 18, 'published', now()),
  ('Kenya', 'KEN', -0.0236, 37.9062, 19, 'published', now()),
  ('Kyrgyzstan', 'KGZ', 41.2044, 74.7661, 20, 'published', now()),
  ('Lebanon', 'LBN', 33.8547, 35.8623, 21, 'published', now()),
  ('Libya', 'LBY', 26.3351, 17.2283, 22, 'published', now()),
  ('Madagascar', 'MDG', -18.7669, 46.8691, 23, 'published', now()),
  ('Malawi', 'MWI', -13.2543, 34.3015, 24, 'published', now()),
  ('Mali', 'MLI', 17.5707, -3.9962, 25, 'published', now()),
  ('Marshall Islands', 'MHL', 7.1315, 171.1845, 26, 'published', now()),
  ('Mauritania', 'MRT', 21.0079, -10.9408, 27, 'published', now()),
  ('Morocco', 'MAR', 31.7917, -7.0926, 28, 'published', now()),
  ('Niger', 'NER', 17.6078, 8.0817, 29, 'published', now()),
  ('Palau', 'PLW', 7.515, 134.5825, 30, 'published', now()),
  ('Peru', 'PER', -9.19, -75.0152, 31, 'published', now()),
  ('Philippines', 'PHL', 12.8797, 121.774, 32, 'published', now()),
  ('Pohnpei', 'FSM', 6.8541, 158.2624, 33, 'published', now()),
  ('Russia', 'RUS', 61.524, 105.3188, 34, 'published', now()),
  ('Senegal', 'SEN', 14.4974, -14.4524, 35, 'published', now()),
  ('Serbia', 'SRB', 44.0165, 21.0059, 36, 'published', now()),
  ('Solomon Islands', 'SLB', -9.6457, 160.1562, 37, 'published', now()),
  ('Somalia', 'SOM', 5.1521, 46.1996, 38, 'published', now()),
  ('South Sudan', 'SSD', 6.877, 31.307, 39, 'published', now()),
  ('Tajikistan', 'TJK', 38.861, 71.2761, 40, 'published', now()),
  ('Tanzania', 'TZA', -6.369, 34.8888, 41, 'published', now()),
  ('T?rkiye', 'TUR', 38.9637, 35.2433, 42, 'published', now()),
  ('Uganda', 'UGA', 1.3733, 32.2903, 43, 'published', now()),
  ('USA', 'USA', 37.0902, -95.7129, 44, 'published', now())
on conflict do nothing;

update public.geographic_reach set iso_alpha3 = 'AFG', latitude = 33.9391, longitude = 67.71, display_order = 1 where lower(country_name) = lower('Afghanistan');
update public.geographic_reach set iso_alpha3 = 'ALB', latitude = 41.1533, longitude = 20.1683, display_order = 2 where lower(country_name) = lower('Albania');
update public.geographic_reach set iso_alpha3 = 'BRA', latitude = -14.235, longitude = -51.9253, display_order = 3 where lower(country_name) = lower('Brazil');
update public.geographic_reach set iso_alpha3 = 'BFA', latitude = 12.2383, longitude = -1.5616, display_order = 4 where lower(country_name) = lower('Burkina Faso');
update public.geographic_reach set iso_alpha3 = 'CHN', latitude = 35.8617, longitude = 104.1954, display_order = 5 where lower(country_name) = lower('China');
update public.geographic_reach set iso_alpha3 = 'FSM', latitude = 7.4256, longitude = 151.7835, display_order = 6 where lower(country_name) = lower('Chuuk');
update public.geographic_reach set iso_alpha3 = 'COK', latitude = -21.2367, longitude = -159.7777, display_order = 7 where lower(country_name) = lower('Cook Islands');
update public.geographic_reach set iso_alpha3 = 'CIV', latitude = 7.54, longitude = -5.5471, display_order = 8 where lower(country_name) = lower('Côte d''Ivoire');
update public.geographic_reach set iso_alpha3 = 'COD', latitude = -4.0383, longitude = 21.7587, display_order = 9 where lower(country_name) = lower('DRC');
update public.geographic_reach set iso_alpha3 = 'ECU', latitude = -1.8312, longitude = -78.1834, display_order = 10 where lower(country_name) = lower('Ecuador');
update public.geographic_reach set iso_alpha3 = 'ETH', latitude = 9.145, longitude = 40.4897, display_order = 11 where lower(country_name) = lower('Ethiopia');
update public.geographic_reach set iso_alpha3 = 'FSM', latitude = 7.4256, longitude = 150.5508, display_order = 12 where lower(country_name) = lower('Federated States of Micronesia');
update public.geographic_reach set iso_alpha3 = 'FJI', latitude = -17.7134, longitude = 178.065, display_order = 13 where lower(country_name) = lower('Fiji');
update public.geographic_reach set iso_alpha3 = 'FRA', latitude = 46.2276, longitude = 2.2137, display_order = 14 where lower(country_name) = lower('France');
update public.geographic_reach set iso_alpha3 = 'GHA', latitude = 7.9465, longitude = -1.0232, display_order = 15 where lower(country_name) = lower('Ghana');
update public.geographic_reach set iso_alpha3 = 'GTM', latitude = 15.7835, longitude = -90.2308, display_order = 16 where lower(country_name) = lower('Guatemala');
update public.geographic_reach set iso_alpha3 = 'GIN', latitude = 9.9456, longitude = -9.6966, display_order = 17 where lower(country_name) = lower('Guinea');
update public.geographic_reach set iso_alpha3 = 'KAZ', latitude = 48.0196, longitude = 66.9237, display_order = 18 where lower(country_name) = lower('Kazakhstan');
update public.geographic_reach set iso_alpha3 = 'KEN', latitude = -0.0236, longitude = 37.9062, display_order = 19 where lower(country_name) = lower('Kenya');
update public.geographic_reach set iso_alpha3 = 'KGZ', latitude = 41.2044, longitude = 74.7661, display_order = 20 where lower(country_name) = lower('Kyrgyzstan');
update public.geographic_reach set iso_alpha3 = 'LBN', latitude = 33.8547, longitude = 35.8623, display_order = 21 where lower(country_name) = lower('Lebanon');
update public.geographic_reach set iso_alpha3 = 'LBY', latitude = 26.3351, longitude = 17.2283, display_order = 22 where lower(country_name) = lower('Libya');
update public.geographic_reach set iso_alpha3 = 'MDG', latitude = -18.7669, longitude = 46.8691, display_order = 23 where lower(country_name) = lower('Madagascar');
update public.geographic_reach set iso_alpha3 = 'MWI', latitude = -13.2543, longitude = 34.3015, display_order = 24 where lower(country_name) = lower('Malawi');
update public.geographic_reach set iso_alpha3 = 'MLI', latitude = 17.5707, longitude = -3.9962, display_order = 25 where lower(country_name) = lower('Mali');
update public.geographic_reach set iso_alpha3 = 'MHL', latitude = 7.1315, longitude = 171.1845, display_order = 26 where lower(country_name) = lower('Marshall Islands');
update public.geographic_reach set iso_alpha3 = 'MRT', latitude = 21.0079, longitude = -10.9408, display_order = 27 where lower(country_name) = lower('Mauritania');
update public.geographic_reach set iso_alpha3 = 'MAR', latitude = 31.7917, longitude = -7.0926, display_order = 28 where lower(country_name) = lower('Morocco');
update public.geographic_reach set iso_alpha3 = 'NER', latitude = 17.6078, longitude = 8.0817, display_order = 29 where lower(country_name) = lower('Niger');
update public.geographic_reach set iso_alpha3 = 'PLW', latitude = 7.515, longitude = 134.5825, display_order = 30 where lower(country_name) = lower('Palau');
update public.geographic_reach set iso_alpha3 = 'PER', latitude = -9.19, longitude = -75.0152, display_order = 31 where lower(country_name) = lower('Peru');
update public.geographic_reach set iso_alpha3 = 'PHL', latitude = 12.8797, longitude = 121.774, display_order = 32 where lower(country_name) = lower('Philippines');
update public.geographic_reach set iso_alpha3 = 'FSM', latitude = 6.8541, longitude = 158.2624, display_order = 33 where lower(country_name) = lower('Pohnpei');
update public.geographic_reach set iso_alpha3 = 'RUS', latitude = 61.524, longitude = 105.3188, display_order = 34 where lower(country_name) = lower('Russia');
update public.geographic_reach set iso_alpha3 = 'SEN', latitude = 14.4974, longitude = -14.4524, display_order = 35 where lower(country_name) = lower('Senegal');
update public.geographic_reach set iso_alpha3 = 'SRB', latitude = 44.0165, longitude = 21.0059, display_order = 36 where lower(country_name) = lower('Serbia');
update public.geographic_reach set iso_alpha3 = 'SLB', latitude = -9.6457, longitude = 160.1562, display_order = 37 where lower(country_name) = lower('Solomon Islands');
update public.geographic_reach set iso_alpha3 = 'SOM', latitude = 5.1521, longitude = 46.1996, display_order = 38 where lower(country_name) = lower('Somalia');
update public.geographic_reach set iso_alpha3 = 'SSD', latitude = 6.877, longitude = 31.307, display_order = 39 where lower(country_name) = lower('South Sudan');
update public.geographic_reach set iso_alpha3 = 'TJK', latitude = 38.861, longitude = 71.2761, display_order = 40 where lower(country_name) = lower('Tajikistan');
update public.geographic_reach set iso_alpha3 = 'TZA', latitude = -6.369, longitude = 34.8888, display_order = 41 where lower(country_name) = lower('Tanzania');
update public.geographic_reach set iso_alpha3 = 'TUR', latitude = 38.9637, longitude = 35.2433, display_order = 42 where lower(country_name) = lower('T?rkiye');
update public.geographic_reach set iso_alpha3 = 'UGA', latitude = 1.3733, longitude = 32.2903, display_order = 43 where lower(country_name) = lower('Uganda');
update public.geographic_reach set iso_alpha3 = 'USA', latitude = 37.0902, longitude = -95.7129, display_order = 44 where lower(country_name) = lower('USA');
