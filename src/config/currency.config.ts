import UAEDirham from "../assets/images/flags/ae.webp";
import ArgentinePeso from "../assets/images/flags/ar.webp";
import AustralianDollar from "../assets/images/flags/au.webp";
import BangladeshiTaka from "../assets/images/flags/bd.webp";
import BulgarianLev from "../assets/images/flags/bg.webp";
import BahrainiDinar from "../assets/images/flags/bh.webp";
import BrazilianReal from "../assets/images/flags/br.webp";
import CanadianDollar from "../assets/images/flags/ca.webp";
import SwissFranc from "../assets/images/flags/ch.webp";
import ChileanPeso from "../assets/images/flags/cl.webp";
import ChineseYuan from "../assets/images/flags/cn.webp";

import ColombianPeso from "../assets/images/flags/co.webp";
import CyprusEuro from "../assets/images/flags/cy.webp";
import CzechKoruna from "../assets/images/flags/cz.webp";
import DanishKrone from "../assets/images/flags/dk.webp";
import EgyptianPound from "../assets/images/flags/eg.webp";
import Euro from "../assets/images/flags/eu.webp";
import BritishPound from "../assets/images/flags/gb.webp";
import HongKongDollar from "../assets/images/flags/hk.webp";
import HMDollar from "../assets/images/flags/hm.webp";
import HonduranLempira from "../assets/images/flags/hn.webp";
import CroatianEuro from "../assets/images/flags/hr.webp";

import HaitianGourde from "../assets/images/flags/ht.webp";
import HungarianForint from "../assets/images/flags/hu.webp";
import IndonesianRupiah from "../assets/images/flags/id.webp";
import IndianRupee from "../assets/images/flags/in.webp";
import IcelandicKrona from "../assets/images/flags/is.webp";
import JordanianDinar from "../assets/images/flags/jo.webp";
import JapaneseYen from "../assets/images/flags/jp.webp";
import KenyanShilling from "../assets/images/flags/ke.webp";
import SouthKoreanWon from "../assets/images/flags/kr.webp";
import KuwaitiDinar from "../assets/images/flags/kw.webp";
import LebanesePound from "../assets/images/flags/lb.webp";

import EastCaribbeanDollar from "../assets/images/flags/lc.webp";
import SriLankanRupee from "../assets/images/flags/lk.webp";
import MoroccanDirham from "../assets/images/flags/ma.webp";
import MexicanPeso from "../assets/images/flags/mx.webp";
import MalaysianRinggit from "../assets/images/flags/my.webp";
import NigerianNaira from "../assets/images/flags/ng.webp";
import NorwegianKrone from "../assets/images/flags/no.webp";
import NepaleseRupee from "../assets/images/flags/np.webp";
import NewZealandDollar from "../assets/images/flags/nz.webp";
import OmaniRial from "../assets/images/flags/om.webp";
import PeruvianSol from "../assets/images/flags/pe.webp";

import PhilippinePeso from "../assets/images/flags/ph.webp";
import PakistaniRupee from "../assets/images/flags/pk.webp";
import PolishZloty from "../assets/images/flags/pl.webp";
import QatariRiyal from "../assets/images/flags/qa.webp";
import RomanianLeu from "../assets/images/flags/ro.webp";
import RussianRuble from "../assets/images/flags/ru.webp";
import SaudiRiyal from "../assets/images/flags/sa.webp";
import SwedishKrona from "../assets/images/flags/se.webp";
import SingaporeDollar from "../assets/images/flags/sg.webp";
import ThaiBaht from "../assets/images/flags/th.webp";
import TurkishLira from "../assets/images/flags/tr.webp";

import NewTaiwanDollar from "../assets/images/flags/tw.webp";
import UkrainianHryvnia from "../assets/images/flags/ua.webp";
import UnitedStatesDollar from "../assets/images/flags/us.webp";
import VietnameseDong from "../assets/images/flags/vn.webp";
import SouthAfricanRand from "../assets/images/flags/za.webp";

export type Currency = {
  code: string;
  label: string;
  image: string;
};

export const currencies: Currency[] = [
  { code: "aed", label: "UAE Dirham", image: UAEDirham },
  { code: "ars", label: "Argentine Peso", image: ArgentinePeso },
  { code: "aud", label: "Australian Dollar", image: AustralianDollar },
  { code: "bdt", label: "Bangladeshi Taka", image: BangladeshiTaka },
  { code: "bgn", label: "Bulgarian Lev", image: BulgarianLev },
  { code: "bhd", label: "Bahraini Dinar", image: BahrainiDinar },
  { code: "brl", label: "Brazilian Real", image: BrazilianReal },
  { code: "cad", label: "Canadian Dollar", image: CanadianDollar },
  { code: "chf", label: "Swiss Franc", image: SwissFranc },
  { code: "clp", label: "Chilean Peso", image: ChileanPeso },
  { code: "cny", label: "Chinese Yuan", image: ChineseYuan },

  { code: "cop", label: "Colombian Peso", image: ColombianPeso },
  { code: "czk", label: "Czech Koruna", image: CzechKoruna },
  { code: "dkk", label: "Danish Krone", image: DanishKrone },
  { code: "egp", label: "Egyptian Pound", image: EgyptianPound },
  { code: "eur", label: "Euro", image: Euro },
  { code: "gbp", label: "British Pound", image: BritishPound },
  { code: "hkd", label: "Hong Kong Dollar", image: HongKongDollar },
  { code: "aud", label: "Australian Dollar (HM)", image: HMDollar },
  { code: "hnl", label: "Honduran Lempira", image: HonduranLempira },

  { code: "htg", label: "Haitian Gourde", image: HaitianGourde },
  { code: "huf", label: "Hungarian Forint", image: HungarianForint },
  { code: "idr", label: "Indonesian Rupiah", image: IndonesianRupiah },
  { code: "inr", label: "Indian Rupee", image: IndianRupee },
  { code: "isk", label: "Icelandic Króna", image: IcelandicKrona },
  { code: "jod", label: "Jordanian Dinar", image: JordanianDinar },
  { code: "jpy", label: "Japanese Yen", image: JapaneseYen },
  { code: "kes", label: "Kenyan Shilling", image: KenyanShilling },
  { code: "krw", label: "South Korean Won", image: SouthKoreanWon },
  { code: "kwd", label: "Kuwaiti Dinar", image: KuwaitiDinar },
  { code: "lbp", label: "Lebanese Pound", image: LebanesePound },

  { code: "xcd", label: "East Caribbean Dollar", image: EastCaribbeanDollar },
  { code: "lkr", label: "Sri Lankan Rupee", image: SriLankanRupee },
  { code: "mad", label: "Moroccan Dirham", image: MoroccanDirham },
  { code: "mxn", label: "Mexican Peso", image: MexicanPeso },
  { code: "myr", label: "Malaysian Ringgit", image: MalaysianRinggit },
  { code: "ngn", label: "Nigerian Naira", image: NigerianNaira },
  { code: "nok", label: "Norwegian Krone", image: NorwegianKrone },
  { code: "npr", label: "Nepalese Rupee", image: NepaleseRupee },
  { code: "nzd", label: "New Zealand Dollar", image: NewZealandDollar },
  { code: "omr", label: "Omani Rial", image: OmaniRial },
  { code: "pen", label: "Peruvian Sol", image: PeruvianSol },

  { code: "php", label: "Philippine Peso", image: PhilippinePeso },
  { code: "pkr", label: "Pakistani Rupee", image: PakistaniRupee },
  { code: "pln", label: "Polish Złoty", image: PolishZloty },
  { code: "qar", label: "Qatari Riyal", image: QatariRiyal },
  { code: "ron", label: "Romanian Leu", image: RomanianLeu },
  { code: "rub", label: "Russian Ruble", image: RussianRuble },
  { code: "sar", label: "Saudi Riyal", image: SaudiRiyal },
  { code: "sek", label: "Swedish Krona", image: SwedishKrona },
  { code: "sgd", label: "Singapore Dollar", image: SingaporeDollar },
  { code: "thb", label: "Thai Baht", image: ThaiBaht },
  { code: "try", label: "Turkish Lira", image: TurkishLira },

  { code: "twd", label: "New Taiwan Dollar", image: NewTaiwanDollar },
  { code: "uah", label: "Ukrainian Hryvnia", image: UkrainianHryvnia },
  { code: "usd", label: "US Dollar", image: UnitedStatesDollar },
  { code: "vnd", label: "Vietnamese Đồng", image: VietnameseDong },
  { code: "zar", label: "South African Rand", image: SouthAfricanRand },
];
