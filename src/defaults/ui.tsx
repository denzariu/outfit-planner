import { LayoutAnimation } from "react-native";

const palette = {
  black: '#000000',
  white: '#ffffff',

  
  almost_white: "#F9F6EE",
  almost_black: '#252525',

  // Current theme colors
  dark_gray: '#383838',
  forest_green: '#5B796C',
  pale_blue: '#6E8E95',
  ivory: '#F5EFE8',


  dark_purple: "#3e2465",
  purple: '#614F89',
  pink: '#FEA4B9',

  new_age: '#D7CED1',
  starry_night_blue: '#334075',
  conch_shell: '#E6BCAC',
  raspberry_blush: '#D85F56',
  north_sea_green: '#246D74',

  danger_red: '#AA4A44'

}
export const mainAnimation = LayoutAnimation.create(200, 'easeInEaseOut', 'opacity');

export const Theme = {
  colors: {
    background: palette.almost_white,
    foreground: palette.almost_black,

    primary: palette.dark_gray,
    secondary: palette.forest_green,
    tertiary: palette.pale_blue,
    quaternary: palette.ivory,
    
    tabActive: palette.almost_white,
    tabAccent: palette.almost_white + '77',
    tabBackgound: palette.almost_black,
    tabNotification: palette.almost_black,
    
    loadingIndicator: palette.almost_black,
    delete: palette.danger_red
  },

  spacing: {
    elevation: 4,
    page: 20,

    // one pixel
    xxxs: 1,

    xxs: 2,
    xs: 4,
    s: 8,

    ms: 12,
    m: 16,
    
    l: 24,
    xl: 32,
    xxl: 40,
  },

  fontSize: {
    s_s: 11,
    s_m: 12,
    s_l: 14,
    
    m_s: 16,
    m_m: 20,
    m_l: 24,
    
    l_s: 32,
    l_m: 48,
    l_l: 64,
  },

  fontFamily: {
    // butler: 'butler_regular',
    // butler_bold: 'butler_bold',
    // butler_stencil: 'butler_bold_stencil',
  },

  // textVariants: {
  //   header: {
  //     fontFamily: 'Raleway',
  //     fontSize: 36,
  //     fontWeight: 'bold',
  //   },
  //   body: {
  //     fontFamily: 'Merriweather',
  //     fontSize: 16,
  //   },
  // },
};

export const DarkTheme = {
  ...Theme,
  colors: {
    ...Theme.colors,

    
    // background: palette.almost_black,
    // foreground: palette.almost_white,

    // primary: palette.pale_blue,
    // secondary: palette.pale_blue,
    // tertiary: palette.forest_green,
    // quaternary: palette.dark_gray,
    

    // tabActive: palette.almost_white,
    // tabAccent: palette.almost_white + '77',
    // tabBackgound: palette.starry_night_blue,
    // tabNotification: palette.new_age,
    
    // loadingIndicator: palette.new_age
  },
  
};