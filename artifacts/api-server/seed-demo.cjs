const bcrypt = require('bcryptjs');
const { createClient } = require('@libsql/client');

const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

async function ins(sql, vals) { const r = await c.execute(sql, vals); return r.rows[0]?.id; }
async function exists(table, col, val) { const r = await c.execute(`SELECT id FROM ${table} WHERE ${col} = ?`, [val]); return r.rows[0]?.id; }
async function run() {
  const pw = await bcrypt.hash('password123', 10);
  const now = new Date().toISOString();
  const trial = new Date(Date.now() + 14*24*60*60*1000).toISOString();

  const creds = [];

  // ── Healthcare ──
  let orgId = await exists('organizations', 'name', 'City Medical Center') || await ins('INSERT INTO organizations (name,type,country,city,size,industry_pack_id,status,trial_ends_at,created_at) VALUES(?,?,?,?,?,?,?,?,?) RETURNING id', ['City Medical Center','Private','United States','Portland','51-200',1,'active',trial,now]);
  if (!await exists('users', 'email', 'demo@healthcare.com')) { await ins('INSERT INTO users (full_name,email,password_hash,role,organization_id,status,created_at) VALUES(?,?,?,?,?,?,?)', ['Healthcare Admin','demo@healthcare.com',pw,'admin',orgId,'active',now]); }
  creds.push({email:'demo@healthcare.com',pw:'password123',industry:'Healthcare'});
  const hcp1 = await ins('INSERT INTO healthcare_patients (organization_id,first_name,last_name,email,gender,blood_type,allergies,status) VALUES(?,?,?,?,?,?,?,?) RETURNING id', [orgId,'Sarah','Johnson','sarah@email.com','Female','A+','Penicillin','active']);
  const hcp2 = await ins('INSERT INTO healthcare_patients (organization_id,first_name,last_name,email,gender,blood_type,allergies,status) VALUES(?,?,?,?,?,?,?,?) RETURNING id', [orgId,'Mike','Chen','mike@email.com','Male','O-','None','active']);
  const hcp3 = await ins('INSERT INTO healthcare_patients (organization_id,first_name,last_name,email,gender,blood_type,allergies,status) VALUES(?,?,?,?,?,?,?,?) RETURNING id', [orgId,'Emily','Davis','emily@email.com','Female','B+','Sulfa','active']);
  const hcs1 = await ins('INSERT INTO healthcare_staff (organization_id,first_name,last_name,email,role,department,status) VALUES(?,?,?,?,?,?,?) RETURNING id', [orgId,'Dr. James','Wilson','jwilson@med.com','Doctor','Cardiology','active']);
  const hcs2 = await ins('INSERT INTO healthcare_staff (organization_id,first_name,last_name,email,role,department,status) VALUES(?,?,?,?,?,?,?) RETURNING id', [orgId,'Nurse Lisa','Brown','lbrown@med.com','Nurse','ER','active']);
  const hcs3 = await ins('INSERT INTO healthcare_staff (organization_id,first_name,last_name,email,role,department,status) VALUES(?,?,?,?,?,?,?) RETURNING id', [orgId,'Dr. Anna','Martinez','amartinez@med.com','Doctor','Pediatrics','active']);
  await ins('INSERT INTO healthcare_appointments (organization_id,patient_id,staff_id,date,time,reason,status) VALUES(?,?,?,?,?,?,?)', [orgId,hcp1,hcs1,'2026-06-10','09:00','Annual checkup','scheduled']);
  await ins('INSERT INTO healthcare_appointments (organization_id,patient_id,staff_id,date,time,reason,status) VALUES(?,?,?,?,?,?,?)', [orgId,hcp2,hcs2,'2026-06-10','10:30','Chest pain','scheduled']);
  await ins('INSERT INTO healthcare_appointments (organization_id,patient_id,staff_id,date,time,reason,status) VALUES(?,?,?,?,?,?,?)', [orgId,hcp3,hcs3,'2026-06-11','14:00','Vaccination','scheduled']);

  // ── Construction ──
  orgId = await exists('organizations', 'name', 'BuildRight Contractors') || await ins('INSERT INTO organizations (name,type,country,city,size,industry_pack_id,status,trial_ends_at,created_at) VALUES(?,?,?,?,?,?,?,?,?) RETURNING id', ['BuildRight Contractors','Private','United States','Chicago','51-200',2,'active',trial,now]);
  if (!await exists('users', 'email', 'demo@construction.com')) { await ins('INSERT INTO users (full_name,email,password_hash,role,organization_id,status,created_at) VALUES(?,?,?,?,?,?,?)', ['Construction Admin','demo@construction.com',pw,'admin',orgId,'active',now]); }
  creds.push({email:'demo@construction.com',pw:'password123',industry:'Construction'});
  const cn1 = await ins('INSERT INTO construction_projects (organization_id,name,description,location,budget,status) VALUES(?,?,?,?,?,?) RETURNING id', [orgId,'Skyline Tower','40-story residential tower','New York, NY',50000000,'in_progress']);
  const cn2 = await ins('INSERT INTO construction_projects (organization_id,name,description,location,budget,status) VALUES(?,?,?,?,?,?) RETURNING id', [orgId,'River Bridge','Highway bridge over river','Austin, TX',12000000,'planning']);
  const cn3 = await ins('INSERT INTO construction_projects (organization_id,name,description,location,budget,status) VALUES(?,?,?,?,?,?) RETURNING id', [orgId,'Green Valley School','K-12 school building','Denver, CO',8500000,'in_progress']);
  const cw1 = await ins('INSERT INTO construction_workers (organization_id,first_name,last_name,role,certification,status) VALUES(?,?,?,?,?,?) RETURNING id', [orgId,'Carlos','Ramirez','Foreman','OSHA 30','active']);
  await ins('INSERT INTO construction_workers (organization_id,first_name,last_name,role,certification,status) VALUES(?,?,?,?,?,?)', [orgId,'Tom','Miller','Electrician','Master Electrician','active']);
  await ins('INSERT INTO construction_workers (organization_id,first_name,last_name,role,certification,status) VALUES(?,?,?,?,?,?)', [orgId,'Jake','Williams','Operator','Crane Certified','active']);
  await ins('INSERT INTO construction_safety_reports (organization_id,project_id,reported_by,date,severity,description,status) VALUES(?,?,?,?,?,?,?)', [orgId,cn1,'Carlos Ramirez','2026-06-01','low','Missing guardrail on 3rd floor','resolved']);
  await ins('INSERT INTO construction_safety_reports (organization_id,project_id,reported_by,date,severity,description,status) VALUES(?,?,?,?,?,?,?)', [orgId,cn2,'Jake Williams','2026-06-03','medium','Electrical hazard near wet area','investigating']);

  // ── Retail ──
  orgId = await exists('organizations', 'name', 'MegaMart Stores') || await ins('INSERT INTO organizations (name,type,country,city,size,industry_pack_id,status,trial_ends_at,created_at) VALUES(?,?,?,?,?,?,?,?,?) RETURNING id', ['MegaMart Stores','Private','United States','Seattle','51-200',3,'active',trial,now]);
  if (!await exists('users', 'email', 'demo@retail.com')) { await ins('INSERT INTO users (full_name,email,password_hash,role,organization_id,status,created_at) VALUES(?,?,?,?,?,?,?)', ['Retail Admin','demo@retail.com',pw,'admin',orgId,'active',now]); }
  creds.push({email:'demo@retail.com',pw:'password123',industry:'Retail'});
  const rp1 = await ins('INSERT INTO retail_products (organization_id,name,sku,price,category,status) VALUES(?,?,?,?,?,?) RETURNING id', [orgId,'Wireless Headphones','WH-100',149.99,'Electronics','active']);
  const rp2 = await ins('INSERT INTO retail_products (organization_id,name,sku,price,category,status) VALUES(?,?,?,?,?,?) RETURNING id', [orgId,'Organic Coffee Beans','OC-200',24.99,'Groceries','active']);
  const rp3 = await ins('INSERT INTO retail_products (organization_id,name,sku,price,category,status) VALUES(?,?,?,?,?,?) RETURNING id', [orgId,'Yoga Mat','YM-001',39.99,'Sports','active']);
  await ins('INSERT INTO retail_products (organization_id,name,sku,price,category,status) VALUES(?,?,?,?,?,?)', [orgId,'Desk Lamp','DL-050',59.99,'Home','active']);
  await ins('INSERT INTO retail_products (organization_id,name,sku,price,category,status) VALUES(?,?,?,?,?,?)', [orgId,'Running Shoes','RS-300',129.99,'Sports','active']);
  await ins('INSERT INTO retail_inventory (organization_id,product_id,quantity,reorder_level,location) VALUES(?,?,?,?,?)', [orgId,rp1,45,10,'Warehouse A']);
  await ins('INSERT INTO retail_inventory (organization_id,product_id,quantity,reorder_level,location) VALUES(?,?,?,?,?)', [orgId,rp2,120,30,'Warehouse B']);
  await ins('INSERT INTO retail_inventory (organization_id,product_id,quantity,reorder_level,location) VALUES(?,?,?,?,?)', [orgId,rp3,80,15,'Warehouse A']);
  await ins('INSERT INTO retail_customers (organization_id,first_name,last_name,email,loyalty_points,status) VALUES(?,?,?,?,?,?)', [orgId,'Alice','Thompson','alice@email.com',250,'active']);
  await ins('INSERT INTO retail_customers (organization_id,first_name,last_name,email,loyalty_points,status) VALUES(?,?,?,?,?,?)', [orgId,'Bob','Anderson','bob@email.com',580,'active']);

  // ── Technology ──
  orgId = await exists('organizations', 'name', 'CloudNine Dev') || await ins('INSERT INTO organizations (name,type,country,city,size,industry_pack_id,status,trial_ends_at,created_at) VALUES(?,?,?,?,?,?,?,?,?) RETURNING id', ['CloudNine Dev','Private','United States','San Francisco','11-50',5,'active',trial,now]);
  if (!await exists('users', 'email', 'demo@tech.com')) { await ins('INSERT INTO users (full_name,email,password_hash,role,organization_id,status,created_at) VALUES(?,?,?,?,?,?,?)', ['Tech Admin','demo@tech.com',pw,'admin',orgId,'active',now]); }
  creds.push({email:'demo@tech.com',pw:'password123',industry:'Technology'});
  const tp1 = await ins('INSERT INTO technology_projects (organization_id,name,description,repository,status) VALUES(?,?,?,?,?) RETURNING id', [orgId,'Customer Portal','Customer self-service portal','github.com/cloudnine/portal','in_progress']);
  const tp2 = await ins('INSERT INTO technology_projects (organization_id,name,description,repository,status) VALUES(?,?,?,?,?) RETURNING id', [orgId,'Mobile App v2','React Native rewrite','github.com/cloudnine/mobile','planning']);
  const tp3 = await ins('INSERT INTO technology_projects (organization_id,name,description,repository,status) VALUES(?,?,?,?,?) RETURNING id', [orgId,'AI Analytics','ML-powered analytics engine','github.com/cloudnine/ai','in_progress']);
  await ins('INSERT INTO technology_tasks (organization_id,project_id,title,assignee,priority,status,due_date) VALUES(?,?,?,?,?,?,?)', [orgId,tp1,'Setup CI/CD pipeline','Alex Kim','high','done','2026-05-20']);
  await ins('INSERT INTO technology_tasks (organization_id,project_id,title,assignee,priority,status,due_date) VALUES(?,?,?,?,?,?,?)', [orgId,tp3,'Train recommendation model','Sarah Lee','high','in_progress','2026-06-30']);
  await ins('INSERT INTO technology_tasks (organization_id,project_id,title,assignee,priority,status,due_date) VALUES(?,?,?,?,?,?,?)', [orgId,tp2,'Design new user flow','Mike Brown','medium','todo','2026-07-15']);
  await ins('INSERT INTO technology_team_members (organization_id,first_name,last_name,email,role,department,status) VALUES(?,?,?,?,?,?,?)', [orgId,'Alex','Kim','alex@cloudnine.com','Senior Developer','Engineering','active']);
  await ins('INSERT INTO technology_team_members (organization_id,first_name,last_name,email,role,department,status) VALUES(?,?,?,?,?,?,?)', [orgId,'Sarah','Lee','sarah@cloudnine.com','ML Engineer','Data Science','active']);
  await ins('INSERT INTO technology_team_members (organization_id,first_name,last_name,email,role,department,status) VALUES(?,?,?,?,?,?,?)', [orgId,'Mike','Brown','mike@cloudnine.com','Product Designer','Design','active']);

  // ── Finance ──
  orgId = await exists('organizations', 'name', 'Pinnacle Financial') || await ins('INSERT INTO organizations (name,type,country,city,size,industry_pack_id,status,trial_ends_at,created_at) VALUES(?,?,?,?,?,?,?,?,?) RETURNING id', ['Pinnacle Financial','Private','United States','Boston','11-50',6,'active',trial,now]);
  if (!await exists('users', 'email', 'demo@finance.com')) { await ins('INSERT INTO users (full_name,email,password_hash,role,organization_id,status,created_at) VALUES(?,?,?,?,?,?,?)', ['Finance Admin','demo@finance.com',pw,'admin',orgId,'active',now]); }
  creds.push({email:'demo@finance.com',pw:'password123',industry:'Finance'});
  const fa1 = await ins('INSERT INTO finance_accounts (organization_id,name,account_number,type,balance,currency,status) VALUES(?,?,?,?,?,?,?) RETURNING id', [orgId,'Operating Account','CHK-1001','checking',250000,'USD','active']);
  await ins('INSERT INTO finance_accounts (organization_id,name,account_number,type,balance,currency,status) VALUES(?,?,?,?,?,?,?)', [orgId,'Growth Fund','SAV-2002','savings',1500000,'USD','active']);
  await ins('INSERT INTO finance_accounts (organization_id,name,account_number,type,balance,currency,status) VALUES(?,?,?,?,?,?,?)', [orgId,'Corporate Card','CC-3003','credit',45000,'USD','active']);
  await ins('INSERT INTO finance_transactions (organization_id,account_id,type,amount,description,date,category,status) VALUES(?,?,?,?,?,?,?,?)', [orgId,fa1,'credit',50000,'Client payment - Q2','2026-06-01','Revenue','completed']);
  await ins('INSERT INTO finance_transactions (organization_id,account_id,type,amount,description,date,category,status) VALUES(?,?,?,?,?,?,?,?)', [orgId,fa1,'debit',12000,'Office rent','2026-06-01','Rent','completed']);
  await ins('INSERT INTO finance_transactions (organization_id,account_id,type,amount,description,date,category,status) VALUES(?,?,?,?,?,?,?,?)', [orgId,fa1,'debit',3500,'Software licenses','2026-06-02','Software','completed']);
  await ins('INSERT INTO finance_transactions (organization_id,account_id,type,amount,description,date,category,status) VALUES(?,?,?,?,?,?,?,?)', [orgId,fa1,'credit',25000,'Consulting fees','2026-06-05','Revenue','completed']);
  await ins('INSERT INTO finance_budgets (organization_id,name,amount,spent,start_date,end_date,category,status) VALUES(?,?,?,?,?,?,?,?)', [orgId,'Q3 Engineering',200000,45000,'2026-07-01','2026-09-30','Engineering','active']);
  await ins('INSERT INTO finance_budgets (organization_id,name,amount,spent,start_date,end_date,category,status) VALUES(?,?,?,?,?,?,?,?)', [orgId,'Marketing Q3',150000,32000,'2026-07-01','2026-09-30','Marketing','active']);

  // ── Hospitality ──
  orgId = await exists('organizations', 'name', 'Grand Horizon Resort') || await ins('INSERT INTO organizations (name,type,country,city,size,industry_pack_id,status,trial_ends_at,created_at) VALUES(?,?,?,?,?,?,?,?,?) RETURNING id', ['Grand Horizon Resort','Private','United States','Miami','51-200',25,'active',trial,now]);
  if (!await exists('users', 'email', 'demo@hotel.com')) { await ins('INSERT INTO users (full_name,email,password_hash,role,organization_id,status,created_at) VALUES(?,?,?,?,?,?,?)', ['Hospitality Admin','demo@hotel.com',pw,'admin',orgId,'active',now]); }
  creds.push({email:'demo@hotel.com',pw:'password123',industry:'Hospitality'});
  const hr1 = await ins('INSERT INTO hospitality_rooms (organization_id,room_number,type,price_per_night,capacity,status) VALUES(?,?,?,?,?,?) RETURNING id', [orgId,'101','Standard',199,2,'available']);
  const hr2 = await ins('INSERT INTO hospitality_rooms (organization_id,room_number,type,price_per_night,capacity,status) VALUES(?,?,?,?,?,?) RETURNING id', [orgId,'301','Suite',599,4,'available']);
  const hg1 = await ins('INSERT INTO hospitality_guests (organization_id,first_name,last_name,email,nationality,status) VALUES(?,?,?,?,?,?) RETURNING id', [orgId,'Robert','Chen','robert.chen@email.com','Singapore','active']);
  const hg2 = await ins('INSERT INTO hospitality_guests (organization_id,first_name,last_name,email,nationality,status) VALUES(?,?,?,?,?,?) RETURNING id', [orgId,'Maria','Garcia','maria.garcia@email.com','Spain','active']);
  await ins('INSERT INTO hospitality_bookings (organization_id,room_id,guest_id,check_in,check_out,total_amount,status) VALUES(?,?,?,?,?,?,?)', [orgId,hr1,hg1,'2026-06-15','2026-06-20',995,'confirmed']);
  await ins('INSERT INTO hospitality_bookings (organization_id,room_id,guest_id,check_in,check_out,total_amount,status) VALUES(?,?,?,?,?,?,?)', [orgId,hr2,hg2,'2026-06-18','2026-06-25',4193,'confirmed']);

  // ── Media ──
  orgId = await exists('organizations', 'name', 'PulseMedia Group') || await ins('INSERT INTO organizations (name,type,country,city,size,industry_pack_id,status,trial_ends_at,created_at) VALUES(?,?,?,?,?,?,?,?,?) RETURNING id', ['PulseMedia Group','Private','United States','Los Angeles','11-50',27,'active',trial,now]);
  if (!await exists('users', 'email', 'demo@media.com')) { await ins('INSERT INTO users (full_name,email,password_hash,role,organization_id,status,created_at) VALUES(?,?,?,?,?,?,?)', ['Media Admin','demo@media.com',pw,'admin',orgId,'active',now]); }
  creds.push({email:'demo@media.com',pw:'password123',industry:'Media'});
  await ins('INSERT INTO media_articles (organization_id,title,content,author,category,status,published_at) VALUES(?,?,?,?,?,?,?)', [orgId,'The Future of AI in Business','Artificial intelligence is transforming every industry from healthcare to finance. Companies that embrace AI will have a competitive advantage in the coming decade.','John Carter','Technology','published','2026-06-01']);
  await ins('INSERT INTO media_articles (organization_id,title,content,author,category,status,published_at) VALUES(?,?,?,?,?,?,?)', [orgId,'Summer Travel Guide 2026','Top 10 destinations for your summer vacation. From tropical beaches to mountain retreats, find your perfect getaway.','Lisa Park','Travel','published','2026-06-03']);
  await ins('INSERT INTO media_articles (organization_id,title,content,author,category,status) VALUES(?,?,?,?,?,?)', [orgId,'Interview: CEO of GreenTech','Exclusive interview with the CEO of GreenTech about sustainable innovation.','John Carter','Business','draft']);
  await ins('INSERT INTO media_assets (organization_id,name,type,url,file_size,status) VALUES(?,?,?,?,?,?)', [orgId,'hero-banner.jpg','Image','/assets/hero-banner.jpg',2048576,'active']);
  await ins('INSERT INTO media_assets (organization_id,name,type,url,file_size,status) VALUES(?,?,?,?,?,?)', [orgId,'intro-video.mp4','Video','/assets/intro-video.mp4',15728640,'active']);
  await ins('INSERT INTO media_campaigns (organization_id,name,type,budget,start_date,end_date,status) VALUES(?,?,?,?,?,?,?)', [orgId,'Summer Launch','Digital',50000,'2026-06-01','2026-08-31','active']);
  await ins('INSERT INTO media_campaigns (organization_id,name,type,budget,start_date,end_date,status) VALUES(?,?,?,?,?,?,?)', [orgId,'Brand Refresh','Print',25000,'2026-07-01','2026-09-30','active']);

  // ── Government ──
  orgId = await exists('organizations', 'name', 'City of Springfield') || await ins('INSERT INTO organizations (name,type,country,city,size,industry_pack_id,status,trial_ends_at,created_at) VALUES(?,?,?,?,?,?,?,?,?) RETURNING id', ['City of Springfield','Government','United States','Springfield','201-500',29,'active',trial,now]);
  if (!await exists('users', 'email', 'demo@gov.com')) { await ins('INSERT INTO users (full_name,email,password_hash,role,organization_id,status,created_at) VALUES(?,?,?,?,?,?,?)', ['Government Admin','demo@gov.com',pw,'admin',orgId,'active',now]); }
  creds.push({email:'demo@gov.com',pw:'password123',industry:'Government'});
  const gc1 = await ins('INSERT INTO government_citizens (organization_id,first_name,last_name,email,date_of_birth,address,status) VALUES(?,?,?,?,?,?,?) RETURNING id', [orgId,'James','Taylor','jtaylor@email.com','1985-03-12','123 Oak St','active']);
  const gc2 = await ins('INSERT INTO government_citizens (organization_id,first_name,last_name,email,date_of_birth,address,status) VALUES(?,?,?,?,?,?,?) RETURNING id', [orgId,'Mary','Johnson','mjohnson@email.com','1990-07-25','456 Elm Ave','active']);
  await ins('INSERT INTO government_citizens (organization_id,first_name,last_name,email,date_of_birth,address,status) VALUES(?,?,?,?,?,?,?)', [orgId,'David','Wilson','dwilson@email.com','1978-11-03','789 Pine Rd','active']);
  await ins('INSERT INTO government_permits (organization_id,type,applicant_name,description,fee,issue_date,expiry_date,status) VALUES(?,?,?,?,?,?,?,?)', [orgId,'Building Permit','James Taylor','Garage addition',500,'2026-05-01','2026-11-01','approved']);
  await ins('INSERT INTO government_permits (organization_id,type,applicant_name,description,fee,issue_date,expiry_date,status) VALUES(?,?,?,?,?,?,?,?)', [orgId,'Business License','Mary Johnson','Bakery shop',250,'2026-06-01','2027-06-01','approved']);
  await ins('INSERT INTO government_service_requests (organization_id,citizen_id,type,description,priority,status) VALUES(?,?,?,?,?,?)', [orgId,gc1,'Pothole','Large pothole on Oak St near 5th Ave','high','in_progress']);
  await ins('INSERT INTO government_service_requests (organization_id,citizen_id,type,description,priority,status) VALUES(?,?,?,?,?,?)', [orgId,gc2,'Noise Complaint','Loud construction after 8pm on Elm Ave','normal','open']);

  // ── Print credentials ──
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║           DEMO ACCOUNTS - ALL PASSWORD: password123  ║');
  console.log('╠════════════════════╦═══════════════════════╦═════════╣');
  console.log('║ Industry           ║ Email                 ║ Password║');
  console.log('╠════════════════════╬═══════════════════════╬═════════╣');
  for (const c of creds) {
    console.log(`║ ${c.industry.padEnd(18)} ║ ${c.email.padEnd(21)} ║ password123 ║`);
  }
  console.log('╚════════════════════╩═══════════════════════╩═════════╝');
  console.log('\nFrontend: https://saas-architect-ashen.vercel.app');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
