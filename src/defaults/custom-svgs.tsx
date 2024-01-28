// export const svgPants = `
// <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 296.305 296.305" xml:space="preserve">
//   <g>
//     <polygon points="46.846,154.728 101.215,161.07 102.704,147.378 48.29,141.461  "/>
//     <polygon points="248.015,141.461 193.6,147.378 195.089,161.07 249.459,154.728  "/>
//     <path d="M263.579,47.251c-1.031-4.338-4.906-7.4-9.364-7.4H42.105c-4.459,0-8.333,3.062-9.364,7.4l-8.154,34.315h247.147   L263.579,47.251z"/>
//     <path d="M296.197,245.394L273.768,96.567H22.538L0.108,245.394c-0.418,2.772,0.394,5.588,2.222,7.713   c1.828,2.125,4.492,3.347,7.295,3.347h118.953c4.347,0,8.154-2.913,9.29-7.109l10.287-37.985l10.286,37.985   c1.136,4.196,4.944,7.109,9.29,7.109H286.68c2.803,0,5.467-1.222,7.295-3.347C295.804,250.982,296.615,248.166,296.197,245.394z    M118.427,141.543l-6.196,56.995c-0.721,6.669-3.997,12.653-9.225,16.852c-4.481,3.619-9.973,5.547-15.686,5.547   c-0.908,0-1.821-0.049-2.737-0.147l-34.357-3.73c-13.755-1.507-23.727-13.92-22.238-27.673l6.202-57.004   c0.448-4.116,4.148-7.097,8.267-6.645l69.325,7.538C115.899,133.725,118.874,137.425,118.427,141.543z M246.087,217.059   l-34.354,3.729c-0.918,0.099-1.833,0.148-2.742,0.148c-5.72,0-11.211-1.929-15.706-5.558c-5.213-4.187-8.489-10.171-9.21-16.84   l-6.196-56.995c-0.447-4.118,2.527-7.818,6.646-8.267l69.326-7.538c4.13-0.45,7.818,2.528,8.267,6.645l6.201,57   C269.807,203.14,259.835,215.553,246.087,217.059z"/>
//     <path d="M42.899,191.006c-0.6,5.535,3.416,10.536,8.952,11.143l34.341,3.728c2.682,0.284,5.317-0.482,7.405-2.169   c2.114-1.698,3.43-4.102,3.719-6.78c0.001-0.002,0.001-0.003,0.001-0.003l2.277-20.942l-54.37-6.342L42.899,191.006z"/>
//     <path d="M251.081,169.64l-54.371,6.342l2.277,20.94c0,0,0,0.003,0.001,0.005c0.289,2.679,1.604,5.082,3.703,6.768   c2.105,1.7,4.747,2.465,7.432,2.181l34.338-3.727c5.529-0.605,9.544-5.605,8.944-11.146L251.081,169.64z"/>
//   </g>
// </svg>
// `

const svgPants = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="_x32_" viewBox="0 0 512 512" xml:space="preserve">
  <style type="text/css">
    .st0{fill:#000000;}
  </style>
  <g>
    <path class="st0" d="M406.997,51.615H105.002c-2.568,0-4.648,2.08-4.648,4.648V507.36c0,2.56,2.08,4.64,4.648,4.64h117.086   c2.416,0,4.424-1.84,4.632-4.248l24.655-287.267c0.201-2.4,2.216-4.248,4.624-4.248c2.408,0,4.424,1.848,4.623,4.248   l24.656,287.267c0.208,2.408,2.216,4.248,4.632,4.248h117.086c2.568,0,4.648-2.08,4.648-4.64V56.263   C411.646,53.695,409.566,51.615,406.997,51.615z"/>
    <rect x="225.28" class="st0" width="61.439" height="40.144"/>
    <rect x="100.354" class="st0" width="107.718" height="40.144"/>
    <rect x="302.287" class="st0" width="109.358" height="40.144"/>
  </g>
</svg>
`

export const icons = {
  extra: 'hat-fedora',
  top: 'tshirt-crew',
  bottom: svgPants,
  feet: 'shoe-heel',
  all: 'all-inclusive',

  delete: 'trash-can-outline',
  create_outfit: 'plus-box-multiple-outline', //pencil-plus-outline?
  favorite: 'heart-outline',
  duplicate: 'content-duplicate',

  missing: 'help-rhombus',

  // Tab menu icons 
  home: "home-variant",
  calendar: "calendar-blank",
  wardrobe: "wardrobe",
  settings: "cog",

  // Outline menu icons
  home_outline: "home-variant-outline",
  calendar_outline: "calendar-blank-outline",
  wardrobe_outline: "wardrobe-outline",
  settings_outline: "cog-outline",

  plus: 'plus',
  minus: 'minus',

  // Navigation
  chevron_left: 'chevron-left',
  chevron_right: 'chevron-right',
  arrow_left: 'arrow-left',

  // Image Icons
  enlarge: "focus-field-horizontal",
  reduce: "image-size-select-large",

  // Seasons
  season1: "snowflake-variant",
  season2: "flower-poppy",
  season3: "white-balance-sunny",
  season4: "leaf",

  // Weather
  weather1: "weather-snowy-heavy",
  weather2: "weather-partly-cloudy",
  weather3: "weather-pouring",
  weather4: "weather-windy",

  // Upload icons (add item)
  upload: "upload",
  tshirt: "tshirt-crew",

  // Outfit-related
  edit: 'pencil',
  save: "content-save-outline",
  date_pick: "calendar-range-outline",

  dots: 'dots-vertical'
}

// export const svgPants = `
// <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 24 24"><path d="M20,3V6H4V3A1,1,0,0,1,5,2H19A1,1,0,0,1,20,3ZM4,8H20V21a1,1,0,0,1-1,1H14a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v5a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1Zm11,2.141A3.987,3.987,0,0,0,17.859,13V10.141ZM6.141,13A3.987,3.987,0,0,0,9,10.141H6.141Z"/></svg>
// `