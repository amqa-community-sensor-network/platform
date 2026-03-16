-- ============================================================
-- ADEC Sensor Network Tracker — Seed Data
-- Generated from app.js seed data
-- ============================================================

BEGIN;

-- ============================================================
-- 1. COMMUNITIES
--    Parents first (no parent_id), then children
-- ============================================================

-- Parent communities (those that have children, or stand-alone)
INSERT INTO communities (id, name) VALUES
    ('anchorage',   'Anchorage'),
    ('badger',      'Badger'),
    ('bethel',      'Bethel'),
    ('big-lake',    'Big Lake'),
    ('chickaloon',  'Chickaloon'),
    ('cordova',     'Cordova'),
    ('delta-junction', 'Delta Junction'),
    ('fairbanks',   'Fairbanks'),
    ('galena',      'Galena'),
    ('gerstle-river', 'Gerstle River'),
    ('glennallen',  'Glennallen'),
    ('goldstream',  'Goldstream'),
    ('haines',      'Haines'),
    ('homer',       'Homer'),
    ('hoonah',      'Hoonah'),
    ('juneau',      'Juneau'),
    ('kenai',       'Kenai'),
    ('ketchikan',   'Ketchikan'),
    ('kodiak',      'Kodiak'),
    ('kotzebue',    'Kotzebue'),
    ('napaskiak',   'Napaskiak'),
    ('nenana',      'Nenana'),
    ('ninilchik',   'Ninilchik'),
    ('nome',        'Nome'),
    ('palmer',      'Palmer'),
    ('salcha',      'Salcha'),
    ('seward',      'Seward'),
    ('sitka',       'Sitka'),
    ('skagway',     'Skagway'),
    ('soldotna',    'Soldotna'),
    ('talkeetna',   'Talkeetna'),
    ('tok',         'Tok'),
    ('tyonek',      'Tyonek'),
    ('valdez',      'Valdez'),
    ('wasilla',     'Wasilla'),
    ('willow',      'Willow'),
    ('wrangell',    'Wrangell'),
    ('yakutat',     'Yakutat');

-- Child communities (with parent_id references)
INSERT INTO communities (id, name, parent_id) VALUES
    -- Anchorage sub-communities
    ('anc-garden',                    'Garden',                        'anchorage'),
    ('anc-lab',                       'Anc Lab',                       'anchorage'),
    ('campbell-creek-science-center',  'Campbell Creek Science Center', 'anchorage'),
    -- Fairbanks sub-communities
    ('anne-wien-elementary',           'Anne Wien Elementary School',   'fairbanks'),
    ('fbx-lab',                        'Fbx Lab',                      'fairbanks'),
    ('fbx-ncore',                      'NCore',                        'fairbanks'),
    -- Juneau sub-communities
    ('jnu-5th-street',                 '5th Street',                   'juneau'),
    ('jnu-alaska-state-museum',        'Alaska State Museum',          'juneau'),
    ('jnu-floyd-dryden',               'Floyd Dryden',                 'juneau'),
    ('jnu-lab',                        'Jnu Lab',                      'juneau');

-- ============================================================
-- 2. COMMUNITY TAGS
-- ============================================================

INSERT INTO community_tags (community_id, tag) VALUES
    ('anc-garden',      'Regulatory Site'),
    ('fbx-ncore',       'Regulatory Site'),
    ('jnu-floyd-dryden','Regulatory Site'),
    ('glennallen',      'BLM'),
    ('talkeetna',       'BLM');

-- ============================================================
-- 3. SENSORS
-- ============================================================

INSERT INTO sensors (id, soa_tag_id, type, status, community_id, location, date_purchased, collocation_dates) VALUES
    ('MOD-00442',       '', 'Community Pod',  '{}',              'napaskiak',                     '', '', ''),
    ('MOD-00443',       '', 'Community Pod',  '{}',              'fbx-ncore',                     '', '', ''),
    ('MOD-00444',       '', 'Community Pod',  '{}',              'wrangell',                      '', '', ''),
    ('MOD-00445',       '', 'Community Pod',  ARRAY['Lab Storage'], 'anc-lab',                    '', '', ''),
    ('MOD-00446',       '', 'Community Pod',  '{}',              'galena',                        '', '', ''),
    ('MOD-00447',       '', 'Community Pod',  '{}',              'delta-junction',                '', '', ''),
    ('MOD-00448',       '', 'Community Pod',  '{}',              'goldstream',                    '', '', ''),
    ('MOD-00449',       '', 'Community Pod',  '{}',              'ketchikan',                     '', '', ''),
    ('MOD-00450',       '', 'Community Pod',  '{}',              'haines',                        '', '', ''),
    ('MOD-00451',       '', 'Community Pod',  ARRAY['Lab Storage'], 'anc-lab',                    '', '', ''),
    ('MOD-00452',       '', 'Community Pod',  '{}',              'hoonah',                        '', '', ''),
    ('MOD-00453',       '', 'Community Pod',  '{}',              'skagway',                       '', '', ''),
    ('MOD-00454',       '', 'Community Pod',  '{}',              'sitka',                         '', '', ''),
    ('MOD-00455',       '', 'Community Pod',  '{}',              'jnu-lab',                       '', '', ''),
    ('MOD-00456',       '', 'Community Pod',  '{}',              'jnu-lab',                       '', '', ''),
    ('MOD-00458',       '', 'Community Pod',  '{}',              'valdez',                        '', '', ''),
    ('MOD-00459',       '', 'Community Pod',  '{}',              'soldotna',                      '', '', ''),
    ('MOD-00460',       '', 'Audit Pod',      '{}',              'anc-garden',                    '', '', ''),
    ('MOD-00461',       '', 'Community Pod',  '{}',              'ninilchik',                     '', '', ''),
    ('MOD-00462',       '', 'Community Pod',  '{}',              'campbell-creek-science-center',  '', '', ''),
    ('MOD-00463',       '', 'Permanent Pod',  '{}',              'anc-garden',                    '', '', ''),
    ('MOD-00464',       '', 'Community Pod',  '{}',              'homer',                         '', '', ''),
    ('MOD-00465',       '', 'Community Pod',  '{}',              'seward',                        '', '', ''),
    ('MOD-00466',       '', 'Community Pod',  '{}',              'glennallen',                    '', '', ''),
    ('MOD-00467',       '', 'Community Pod',  '{}',              'talkeetna',                     '', '', ''),
    ('MOD-00468',       '', 'Community Pod',  '{}',              'big-lake',                      '', '', ''),
    ('MOD-00469',       '', 'Community Pod',  '{}',              'tyonek',                        '', '', ''),
    ('MOD-00470',       '', 'Community Pod',  '{}',              'willow',                        '', '', ''),
    ('MOD-00471',       '', 'Audit Pod',      '{}',              'anc-garden',                    '', '', ''),
    ('MOD-00649',       '', 'Community Pod',  '{}',              'chickaloon',                    '', '', ''),
    ('MOD-00650',       '', 'Community Pod',  '{}',              'kenai',                         '', '', ''),
    ('MOD-00651',       '', 'Community Pod',  '{}',              'fbx-ncore',                     '', '', ''),
    ('MOD-00652',       '', 'Community Pod',  '{}',              'fbx-ncore',                     '', '', ''),
    ('MOD-00653',       '', 'Community Pod',  '{}',              'tok',                           '', '', ''),
    ('MOD-00654',       '', 'Community Pod',  '{}',              'nome',                          '', '', ''),
    ('MOD-00655',       '', 'Community Pod',  '{}',              'nenana',                        '', '', ''),
    ('MOD-00656',       '', 'Community Pod',  ARRAY['Lab Storage'], NULL,                         '', '', ''),
    ('MOD-00657',       '', 'Community Pod',  '{}',              'palmer',                        '', '', ''),
    ('MOD-00658',       '', 'Community Pod',  '{}',              'yakutat',                       '', '', ''),
    ('MOD-00659',       '', 'Community Pod',  '{}',              'bethel',                        '', '', ''),
    ('MOD-00660',       '', 'Community Pod',  '{}',              'kodiak',                        '', '', ''),
    ('MOD-00662',       '', 'Community Pod',  '{}',              'kotzebue',                      '', '', ''),
    ('MOD-00663',       '', 'Community Pod',  '{}',              'wasilla',                       '', '', ''),
    ('MOD-00664',       '', 'Community Pod',  '{}',              'badger',                        '', '', ''),
    ('MOD-00665',       '', 'Audit Pod',      '{}',              'jnu-lab',                       '', '', ''),
    ('MOD-00666',       '', 'Community Pod',  ARRAY['Lab Storage'], NULL,                         '', '', ''),
    ('MOD-00667',       '', 'Community Pod',  '{}',              'cordova',                       '', '', ''),
    ('MOD-00668',       '', 'Community Pod',  '{}',              'fbx-ncore',                     '', '', ''),
    ('MOD-00669',       '', 'Permanent Pod',  '{}',              'jnu-lab',                       '', '', ''),
    ('MOD-00670',       '', 'Community Pod',  ARRAY['Lab Storage'], NULL,                         '', '', ''),
    ('MOD-00671',       '', 'Community Pod',  '{}',              'anne-wien-elementary',           'Anne Wien Elementary School', '', ''),
    ('MOD-00672',       '', 'Community Pod',  '{}',              'salcha',                        '', '', ''),
    ('MOD-00673',       '', 'Community Pod',  '{}',              'gerstle-river',                 '', '', ''),
    ('MOD-00674',       '', 'Community Pod',  ARRAY['Lab Storage'], NULL,                         '', '', ''),
    ('MOD-X-PM-01656',  '', 'Community Pod',  '{}',              'anc-lab',                       '', '', ''),
    ('MOD-X-PM-01657',  '', 'Community Pod',  '{}',              'anc-lab',                       '', '', ''),
    ('MOD-X-PM-01658',  '', 'Community Pod',  ARRAY['Lab Storage'], NULL,                         '', '', ''),
    ('MOD-X-PM-01754',  '', 'Community Pod',  '{}',              'fbx-ncore',                     '', '', ''),
    ('MOD-X-PM-01755',  '', 'Community Pod',  '{}',              'fbx-ncore',                     '', '', ''),
    ('MOD-X-PM-01757',  '', 'Community Pod',  '{}',              'fbx-ncore',                     '', '', ''),
    ('MOD-X-PM-01758',  '', 'Community Pod',  '{}',              'fbx-ncore',                     '', '', ''),
    ('MOD-X-PM-01759',  '', 'Community Pod',  '{}',              'fbx-ncore',                     '', '', ''),
    ('MOD-X-PM-01760',  '', 'Community Pod',  '{}',              'fbx-ncore',                     '', '', ''),
    ('MOD-X-PM-01761',  '', 'Community Pod',  '{}',              'fbx-ncore',                     '', '', ''),
    ('MOD-X-PM-01762',  '', 'Community Pod',  '{}',              'anc-lab',                       '', '', ''),
    ('MOD-X-PM-01763',  '', 'Community Pod',  '{}',              'fbx-ncore',                     '', '', ''),
    ('MOD-X-PM-01764',  '', 'Community Pod',  '{}',              'fbx-ncore',                     '', '', ''),
    ('MOD-X-PM-01765',  '', 'Community Pod',  '{}',              'anc-lab',                       '', '', ''),
    ('MOD-X-PM-01766',  '', 'Community Pod',  '{}',              'fbx-ncore',                     '', '', '');

-- ============================================================
-- 4. CONTACTS
--    Using hardcoded UUIDs so we can reference them in note_tags
-- ============================================================

INSERT INTO contacts (id, name, role, community_id, email, phone, org) VALUES
    ('a1b2c3d4-0001-4000-8000-000000000001', 'Patricia Valerio', 'Tribal Environmental Coordinator', 'kodiak',   'pvalerio@example.com', '907-555-0101', 'Kodiak Area Native Association'),
    ('a1b2c3d4-0002-4000-8000-000000000002', 'Kim Sweet',        'Village Administrator',             'bethel',   'ksweet@example.com',   '907-555-0202', 'Orutsararmiut Native Council'),
    ('a1b2c3d4-0003-4000-8000-000000000003', 'James Dalton',     'School Principal',                  'wrangell', 'jdalton@example.com',  '907-555-0303', 'Wrangell Public Schools'),
    ('a1b2c3d4-0004-4000-8000-000000000004', 'Maria Chen',       'Librarian',                         'homer',    'mchen@example.com',    '907-555-0404', 'Homer Public Library');

-- ============================================================
-- 5. NOTES
-- ============================================================

INSERT INTO notes (id, date, type, text) VALUES
    ('n1', '2026-03-13', 'Audit',
     'Kodiak sensor MOD-00660 audited by Anchorage audit pod MOD-00471 from March 5 - March 13, 2026, with coordination assistance by @Patricia Valerio.');

-- ============================================================
-- 6. NOTE TAGS
--    Each tagged sensor, community, and contact gets its own row
-- ============================================================

-- Sensor tags for note n1
INSERT INTO note_tags (note_id, tag_type, tag_value) VALUES
    ('n1', 'sensor',    'MOD-00660'),
    ('n1', 'sensor',    'MOD-00471'),
    -- Community tags for note n1
    ('n1', 'community', 'kodiak'),
    ('n1', 'community', 'anchorage'),
    -- Contact tag for note n1
    ('n1', 'contact',   'a1b2c3d4-0001-4000-8000-000000000001');

COMMIT;
