export const T = {
  bg:          '#0F0F0F',
  bg2:         '#161616',
  bg3:         '#1E1E1E',
  bg4:         '#252525',
  text:        '#F0F0F0',
  sub:         '#9A9A9A',
  muted:       '#555',
  border:      'rgba(255,255,255,0.07)',
  border2:     'rgba(255,255,255,0.12)',
  red:         '#E5393B',
  redSoft:     'rgba(229,57,59,0.12)',
  green:       '#4ADE80',
  greenSoft:   'rgba(74,222,128,0.10)',
  gold:        '#FBBF24',
  goldSoft:    'rgba(251,191,36,0.10)',
  violet:      '#C084FC',
  violetSoft:  'rgba(192,132,252,0.10)',
  rose:        '#FB7185',
  roseSoft:    'rgba(251,113,133,0.10)',
}

export const inp = {
  width:        '100%',
  padding:      '13px 15px',
  background:   '#1E1E1E',
  border:       '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  color:        '#F0F0F0',
  outline:      'none',
  fontFamily:   "'DM Sans', sans-serif",
  fontSize:     15,
  boxSizing:    'border-box',
}

export const DAYS  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
export const MEALS = [
  { key: 'breakfast', label: 'Breakfast', icon: '☀️' },
  { key: 'lunch',     label: 'Lunch',     icon: '🌤️' },
  { key: 'dinner',    label: 'Dinner',    icon: '🌙' },
  { key: 'other',     label: 'Other',     icon: '✨' },
]
export const TYPES     = ['Movie', 'Series']
export const PLATFORMS = ['Netflix','Amazon Prime','Hotstar','SonyLIV','ZEE5','YouTube','FMovies','Other']
export const PERSONS   = ['Aru Baby', 'Ruru Baby']

export const TYPE_STYLE = {
  Movie:  { soft: 'rgba(192,132,252,0.10)', color: '#C084FC' },
  Series: { soft: 'rgba(251,191,36,0.10)',  color: '#FBBF24' },
}
export const PERSON_STYLE = {
  'Aru Baby':  { soft: 'rgba(251,113,133,0.10)', color: '#FB7185' },
  'Ruru Baby': { soft: 'rgba(192,132,252,0.10)', color: '#C084FC' },
}
