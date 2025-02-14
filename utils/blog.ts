import swofon from "@/public/assets/images/swofon.png";
import jet from "@/public/assets/images/jet2.jpg";
import { StaticImageData } from "next/image";

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  image: StaticImageData;
  readTime: string;
  category: string;
  time: string;
  content: {
    introduction: {
      client: string;
      overview: string;
    };
    context?: string;
    objectives?: string[];
    sections: {
      title: string;
      content: string;
    }[];
  };
}

export const blogData: BlogPost[] = [
  {
    id: "1",
    title: "Goloka Use for Database for Small-Scale Women Farmers in Nigeria",
    summary:
      "Gaining insights through data collection of the Smallholder Women Farmers Organization in Nigeria (SWOFON) activities and providing strategic planning.",
    image: swofon,
    readTime: "8",
    category: "Agriculture",
    time: " May 31st, 2024",
    content: {
      introduction: {
        client:
          "The Small-Scale Women Farmers Organization in Nigeria (SWOFON) is a coalition of over 500,000 Women Farmers Associations and Groups across 36 states in Nigeria.",
        overview:
          "With support from the International Budget Partnership, SWOFON is partnering with Dataphyte to build a database for small-scale women farmers, featuring hyperlocal data on agriculture efforts.",
      },
      context:
        "Nigerian agricultural labor is dominated by women farmers, who constitute over 70 percent of the workforce and participate in nearly every aspect of the agricultural value chain.",
      objectives: [
        "Spur rural village economic development",
        "Increase food production through capacity building",
        "Introduce innovative technology-driven solutions",
        "Promote financial inclusion and climate resilience",
        "Enhance agroecology and budget tracking",
      ],
      sections: [
        {
          title: "The Problem and Impact",
          content:
            "Nigeria faces significant challenges in budget credibility, and its progress toward achieving the Sustainable Development Goals (SDGs) is stagnating or declining. Reports indicate that Nigeria is unlikely to meet the SDGs by 2030. Critical SDGs such as Zero Hunger and Gender Equality, which impact agriculture and gender sectors, suffer from inadequate government spending and poor budget implementation.",
        },
        {
          title: "The Solution",
          content:
            "Dataphyte will collaborate with SWOFON and its local secretariats across Nigeria's 774 local government areas to collect data from SWOFON members. The initiative includes manual data collection through SWOFON representatives and digital data entry through the Goloka platform, ensuring real-time updates and comprehensive coverage.",
        },
      ],
    },
  },
  {
    id: "2",
    title:
      "Goloka Use in Mining Site Location, Ownership Data, and Verification",
    summary:
      "Exploring the implementation of Goloka for mining site verification and ownership data management in partnership with CJID.",
    image: jet,
    readTime: "6",
    category: "Environment",
    time: " March 31st, 2024",
    content: {
      introduction: {
        client: "Centre for Journalism Innovation and Development (CJID)",
        overview:
          "CJID won the USAID Powering Just Energy Transition Green Minerals Challenge, securing nearly $400,000 in funding to advance its groundbreaking mission in eradicating corruption within green mineral supply chains.",
      },
      sections: [
        {
          title: "The Problem and Impact",
          content:
            "Specific data collection with a focus on accountability was new to the client. The challenge was to implement a system that provides actionable insights and visualizations, requiring a strategic technical partner to deliver an effective solution.",
        },
        {
          title: "The Solution",
          content:
            "Dataphyte, through the use of Goloka and other technical platforms, is gathering data on all major mining sites. This initiative involves identifying process connections of beneficial ownership data access platforms to generate critical ownership profiles.",
        },
        {
          title: "Implementation Strategy",
          content:
            "Dataphyte employs Goloka, a data collection solution, to gather on-the-ground information regarding livelihood, human rights, and the socioeconomic impacts of mining on the residents of targeted mining communities. Field monitors receive comprehensive training on using the Goloka tool to ensure accuracy and reliability in data collection.",
        },
      ],
    },
  },
];
