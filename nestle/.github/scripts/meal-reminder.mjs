import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
const DAYS     = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

function getMondayOfWeek(date) {
  const d   = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))
  d.setHours(0, 0, 0, 0)
  return d
}

async function main() {
  // Compute tomorrow in IST (UTC +5:30)
  const ist      = new Date(Date.now() + 5.5 * 60 * 60 * 1000)
  const tomorrow = new Date(ist)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dayIndex    = tomorrow.getDay()                              // 0=Sun
  const dayName     = DAYS[dayIndex === 0 ? 6 : dayIndex - 1]
  const weekStart   = getMondayOfWeek(tomorrow).toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('meal_plan')
    .select('*')
    .eq('week_start_date', weekStart)
    .eq('day_of_week', dayName)

  if (error) { console.error('Supabase error:', error); process.exit(1) }

  const meals   = {}
  data?.forEach(r => { meals[r.meal_type] = r.content })

  const dateStr = tomorrow.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  const lines = [
    `🏡 *Nestle — Tomorrow's Menu*`,
    `📅 *${dateStr}*`,
    ``,
    meals.breakfast ? `☀️ *Breakfast:* ${meals.breakfast}` : `☀️ *Breakfast:* —`,
    meals.lunch     ? `🌤️ *Lunch:* ${meals.lunch}`         : `🌤️ *Lunch:* —`,
    meals.dinner    ? `🌙 *Dinner:* ${meals.dinner}`       : `🌙 *Dinner:* —`,
    meals.other     ? `\n✨ *Other:* ${meals.other}`       : null,
  ].filter(Boolean).join('\n')

  const url = `https://api.green-api.com/waInstance${process.env.GREEN_API_INSTANCE}/sendMessage/${process.env.GREEN_API_TOKEN}`
  const res = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chatId: process.env.WHATSAPP_GROUP_ID, message: lines }),
  })

  const result = await res.json()
  console.log('Sent:', JSON.stringify(result))
}

main().catch(err => { console.error(err); process.exit(1) })
