"use client";
import { useState, useEffect, useRef } from 'react';

// Detailed timeline with consistent continental shapes for smooth morphing
// Each period has 7 landmasses (matching present day structure) for seamless transitions
const timelineData = [
  {
    year: -200000000,
    name: "Pangaea (200M BCE)",
    description: "All continents united as single supercontinent Pangaea",
    continents: [
      // Main Pangaea body (combines future North America + Europe)
      "M 280 280 Q 300 260 340 255 Q 390 255 440 270 Q 480 285 510 310 Q 535 340 540 380 Q 540 420 520 460 Q 495 495 460 515 Q 420 530 375 530 Q 330 525 295 505 Q 265 480 255 445 Q 250 405 255 365 Q 260 320 280 280 Z",
      // Eastern Pangaea section (future Asia)
      "M 560 270 Q 590 255 630 255 Q 680 260 720 280 Q 755 305 770 345 Q 780 385 770 430 Q 755 470 725 500 Q 690 525 645 530 Q 600 530 565 510 Q 535 485 525 450 Q 520 410 530 370 Q 540 325 560 270 Z",
      // Southern section (future South America area)
      "M 320 540 Q 345 530 380 535 Q 420 542 450 565 Q 475 590 475 625 Q 470 660 450 685 Q 425 705 390 710 Q 350 710 320 690 Q 295 665 290 630 Q 285 595 320 540 Z",
      // Southern section 2 (future Africa area)
      "M 490 450 Q 510 440 540 445 Q 570 452 590 475 Q 610 500 610 535 Q 605 570 585 595 Q 560 615 525 615 Q 490 610 470 585 Q 455 560 460 525 Q 465 490 490 450 Z",
      // Proto-Antarctica position
      "M 380 650 Q 420 640 470 645 Q 520 650 560 665 Q 595 680 600 705 Q 605 730 580 745 Q 550 755 500 755 Q 450 750 410 735 Q 380 715 375 690 Q 370 665 380 650 Z",
      // Eastern fragment (future Australia area)
      "M 700 480 Q 720 475 745 480 Q 770 488 785 510 Q 800 532 795 560 Q 790 588 770 605 Q 745 620 715 620 Q 685 615 665 595 Q 650 570 655 540 Q 660 505 700 480 Z",
      // Far south fragment
      "M 600 620 Q 625 615 655 620 Q 685 628 705 650 Q 720 675 715 705 Q 710 730 685 745 Q 655 755 620 750 Q 590 740 575 715 Q 565 690 570 665 Q 575 635 600 620 Z"
    ],
    rotation: 0,
    color: "#8B4513",
    tectonicActivity: "high"
  },
  {
    year: -150000000,
    name: "Pangaea Breaking (150M BCE)",
    description: "Pangaea begins rifting - Laurasia and Gondwana separating",
    continents: [
      // Northern Laurasia - western part (future North America)
      "M 260 270 Q 285 255 320 255 Q 365 260 400 280 Q 430 305 440 340 Q 445 380 435 420 Q 420 455 395 480 Q 365 500 325 505 Q 285 505 255 485 Q 230 460 225 425 Q 220 385 230 345 Q 240 305 260 270 Z",
      // Northern Laurasia - eastern part (future Europe + Asia)
      "M 520 260 Q 560 250 610 255 Q 670 265 720 290 Q 760 320 775 365 Q 785 410 770 460 Q 750 505 715 535 Q 670 560 620 565 Q 570 565 530 545 Q 500 520 490 485 Q 485 445 495 405 Q 505 360 520 260 Z",
      // Gondwana - western (future South America)
      "M 310 520 Q 340 510 375 515 Q 415 525 445 550 Q 470 580 470 620 Q 465 660 445 690 Q 420 715 380 720 Q 340 720 310 700 Q 285 675 280 640 Q 275 600 310 520 Z",
      // Gondwana - central (future Africa)
      "M 480 470 Q 510 460 545 465 Q 585 475 615 505 Q 640 535 640 575 Q 635 615 610 645 Q 580 670 540 675 Q 500 675 470 655 Q 445 630 445 595 Q 445 555 480 470 Z",
      // Antarctica separating
      "M 390 660 Q 435 650 490 655 Q 545 660 590 680 Q 625 700 630 730 Q 635 760 610 780 Q 580 795 530 795 Q 475 790 430 770 Q 395 750 385 720 Q 380 690 390 660 Z",
      // Proto-India + Australia
      "M 710 490 Q 735 480 765 485 Q 800 495 825 520 Q 845 550 840 585 Q 835 620 810 645 Q 780 665 745 665 Q 710 660 685 635 Q 665 605 670 570 Q 675 530 710 490 Z",
      // Small fragment
      "M 620 630 Q 650 625 680 632 Q 710 642 730 665 Q 745 690 740 720 Q 735 745 710 760 Q 680 770 645 765 Q 615 755 600 730 Q 590 705 595 680 Q 600 650 620 630 Z"
    ],
    rotation: 5,
    color: "#A0522D",
    tectonicActivity: "high"
  },
  {
    year: -100000000,
    name: "Cretaceous (100M BCE)",
    description: "Continents drifting, Atlantic Ocean opening",
    continents: [
      // North America (drifting west)
      "M 210 265 Q 240 250 280 250 Q 330 255 370 275 Q 405 300 415 340 Q 420 385 410 430 Q 395 470 365 495 Q 330 515 290 520 Q 250 520 220 500 Q 195 475 190 440 Q 185 400 195 360 Q 205 315 210 265 Z",
      // Eurasia (more defined)
      "M 470 255 Q 525 245 585 250 Q 650 260 705 285 Q 745 310 765 350 Q 780 395 770 445 Q 755 490 725 520 Q 685 545 635 550 Q 580 550 530 535 Q 490 515 465 485 Q 450 450 450 410 Q 450 365 470 255 Z",
      // South America
      "M 270 480 Q 305 470 345 475 Q 390 485 420 515 Q 445 550 445 590 Q 440 635 415 665 Q 385 690 345 695 Q 305 695 275 675 Q 250 650 245 615 Q 240 575 270 480 Z",
      // Africa (moving with South America)
      "M 465 410 Q 500 395 545 400 Q 595 410 630 440 Q 660 475 665 520 Q 665 565 645 600 Q 620 630 580 645 Q 535 655 490 645 Q 455 630 435 600 Q 420 565 425 525 Q 430 480 465 410 Z",
      // Antarctica
      "M 370 675 Q 420 665 480 670 Q 540 675 590 695 Q 630 715 635 750 Q 640 785 615 805 Q 585 820 530 820 Q 470 815 420 795 Q 380 770 370 735 Q 365 700 370 675 Z",
      // India (moving north)
      "M 690 450 Q 715 440 745 445 Q 775 455 795 480 Q 810 510 805 545 Q 800 580 775 605 Q 745 625 710 625 Q 675 620 655 595 Q 640 565 645 530 Q 650 490 690 450 Z",
      // Australia (separating)
      "M 745 540 Q 775 535 810 542 Q 845 552 870 580 Q 890 610 885 645 Q 880 680 855 705 Q 825 725 785 725 Q 745 720 720 695 Q 700 665 705 630 Q 710 590 745 540 Z"
    ],
    rotation: 10,
    color: "#CD853F",
    tectonicActivity: "moderate"
  },
  {
    year: -50000000,
    name: "Eocene (50M BCE)",
    description: "India colliding with Asia, forming Himalayas",
    continents: [
      // North America
      "M 170 270 Q 200 250 245 250 Q 300 255 345 280 Q 380 310 390 355 Q 395 405 385 455 Q 370 500 340 530 Q 305 555 260 560 Q 215 560 180 535 Q 155 505 150 465 Q 145 420 155 375 Q 165 325 170 270 Z",
      // Eurasia (India colliding)
      "M 440 265 Q 510 250 590 260 Q 670 275 735 310 Q 785 345 805 395 Q 820 450 805 510 Q 785 565 745 600 Q 695 630 640 635 Q 580 635 525 615 Q 480 590 455 555 Q 440 515 440 470 Q 440 420 440 365 Q 440 315 440 265 Z",
      // South America
      "M 260 490 Q 290 475 335 480 Q 385 490 420 520 Q 450 555 450 600 Q 445 650 420 685 Q 390 715 350 720 Q 305 720 270 695 Q 245 665 240 625 Q 235 580 260 490 Z",
      // Africa
      "M 470 425 Q 510 410 560 415 Q 615 425 655 460 Q 685 500 690 550 Q 690 600 665 640 Q 635 675 590 690 Q 540 700 490 685 Q 450 665 430 630 Q 415 590 420 545 Q 425 495 470 425 Z",
      // Antarctica
      "M 360 695 Q 415 685 480 690 Q 545 695 600 715 Q 645 735 650 770 Q 655 810 625 835 Q 590 855 535 855 Q 475 850 420 830 Q 375 805 365 765 Q 360 725 360 695 Z",
      // India (colliding with Asia - smaller separate piece)
      "M 650 380 Q 675 375 705 382 Q 735 392 755 415 Q 770 440 765 470 Q 760 500 740 520 Q 715 535 685 530 Q 655 525 640 505 Q 630 485 635 460 Q 640 430 650 380 Z",
      // Australia (moving north)
      "M 760 520 Q 790 510 825 517 Q 865 527 895 555 Q 920 590 915 630 Q 910 670 880 700 Q 845 725 800 725 Q 755 720 725 690 Q 705 655 710 615 Q 715 570 760 520 Z"
    ],
    rotation: 15,
    color: "#DAA520",
    tectonicActivity: "high"
  },
    description: "India colliding with Asia, forming Himalayas",
    continents: [
      // North America (moving west)
      "M 180 260 Q 210 240 250 235 Q 295 235 335 250 Q 365 270 375 300 Q 380 335 370 370 Q 355 400 330 420 Q 300 435 265 435 Q 230 430 205 410 Q 185 385 180 355 Q 175 320 180 260 Z",
      // Eurasia + India collision
      "M 420 250 Q 480 235 550 240 Q 620 250 680 275 Q 730 300 755 335 Q 770 370 760 410 Q 745 445 715 470 Q 675 490 625 495 Q 570 495 515 480 Q 470 465 440 440 Q 420 415 415 385 Q 410 350 420 250 Z",
      // South America
      "M 260 460 Q 290 445 330 450 Q 370 458 400 480 Q 425 505 425 540 Q 420 575 400 600 Q 375 620 340 625 Q 300 625 270 610 Q 245 590 240 560 Q 235 525 260 460 Z",
      // Africa
      "M 470 390 Q 500 380 540 385 Q 580 395 610 420 Q 635 445 640 480 Q 640 515 625 545 Q 605 570 575 585 Q 540 595 500 590 Q 465 580 445 555 Q 430 530 435 500 Q 440 465 470 390 Z",
      // Australia (separating)
      "M 720 480 Q 745 475 775 480 Q 805 488 825 510 Q 840 532 835 560 Q 830 588 810 605 Q 785 620 755 620 Q 725 615 705 595 Q 690 575 690 550 Q 690 520 720 480 Z"
    ],
    rotation: 15,
    color: "#DAA520",
    tectonicActivity: "high"
  },
  {
    year: 0,
    name: "Present Day (2025 CE)",
    description: "Current continental positions - Modern Earth",
    continents: [
      // North America (more detailed)
      "M 150 270 Q 185 245 230 240 Q 280 240 325 260 Q 360 280 375 315 Q 385 350 380 390 Q 370 425 345 450 Q 315 470 280 475 Q 240 475 205 455 Q 175 430 165 395 Q 155 355 150 270 Z",
      // South America
      "M 240 475 Q 270 460 310 465 Q 350 475 380 500 Q 405 530 405 565 Q 400 605 380 635 Q 355 660 320 665 Q 280 665 250 645 Q 225 620 220 585 Q 215 545 240 475 Z",
      // Europefurther west)
      "M 130 280 Q 165 260 215 260 Q 275 265 325 290 Q 365 320 375 370 Q 385 425 375 480 Q 360 530 330 560 Q 295 585 250 590 Q 205 590 170 565 Q 145 535 140 490 Q 135 440 145 390 Q 155 335 130 280 Z",
      // Eurasia-Africa collision (Mediterranean closing)
      "M 450 275 Q 530 260 620 270 Q 710 285 785 320 Q 845 360 870 420 Q 890 485 875 555 Q 855 620 815 665 Q 765 705 700 715 Q 630 720 565 705 Q 510 685 475 650 Q 455 615 450 575 Q 445 530 450 480 Q 455 425 450 370 Q 450 320 450 275 Z",
      // South America (stable)
      "M 240 505 Q 275 490 320 495 Q 370 505 405 535 Q 435 570 435 615 Q 430 665 405 700 Q 375 730 335 735 Q 290 735 255 710 Q 230 680 225 640 Q 220 595 240 505 Z",
      // Africa-Europe merged
      "M 480 340 Q 520 330 570 337 Q 625 347 665 377 Q 700 410 710 455 Q 715 505 695 550 Q 670 590 635 615 Q 590 635 540 635 Q 490 630 460 605 Q 440 575 440 535 Q 440 490 450 445 Q 460 395 480 340 Z",
      // Antarctica
      "M 355 705 Q 425 695 505 700 Q 585 705 650 725 Q 705 745 715 785 Q 720 825 690 850 Q 655 870 600 870 Q 520 865 445 850 Q 385 830 360 795 Q 345 760 350 730 Q 355 710 355 705 Z",
      // Australia (closer to Asia)
      "M 780 490 Q 815 480 855 487 Q 900 497 935 525 Q 965 560 960 605 Q 955 650 925 680 Q 885 705 840 705 Q 795 700 760 670 Q 735 640 740 600 Q 745 555 780 490 Z",
      // Small fragment
      "M 730 580 Q 755 575 785 582 Q 815 592 835 615 Q 850 640 845 670 Q 840 695 815 710 Q 785 720 750 715 Q 720 705 705 680 Q 695 655 700 630 Q 705 600 730 580 Z"
    ],
    rotation: 20,
    color: "#228B22",
    tectonicActivity: "low"
  },
  {
    year: 10000000merging
      "M 160 310 Q 205 280 265 280 Q 335 285 395 315 Q 445 350 465 405 Q 475 465 465 530 Q 450 595 415 645 Q 375 685 320 700 Q 260 710 205 690 Q 160 665 135 625 Q 120 580 125 530 Q 130 475 145 420 Q 160 365 160 310 Z",
      // Afro-Euro-Asia (Australia approaching)
      "M 490 290 Q 580 275 680 290 Q 780 310 860 355 Q 920 405 940 475 Q 955 550 930 625 Q 900 690 845 730 Q 780 760 710 765 Q 635 765 570 745 Q 515 720 480 680 Q 460 640 455 595 Q 450 545 460 495 Q 470 440 475 385 Q 480 335 490 290 Z",
      // South America section
      "M 220 550 Q 255 535 300 540 Q 350 550 385 580 Q 415 615 415 660 Q 410 710 385 745 Q 355 775 315 780 Q 270 780 235 755 Q 210 725 205 685 Q 200 640 220 550 Z",
      // Africa-Europe section
      "M 485 390 Q 525 380 575 387 Q 630 397 670 427 Q 705 460 715 510 Q 720 565 700 615 Q 675 660 640 685 Q 595 705 545 705 Q 495 700 465 675 Q 445 645 445 605 Q 445 560 455 515 Q 465 465 485 390 Z",
      // Antarctica
      "M 350 715 Q 430 705 520 710 Q 610 715 680 735 Q 740 755 750 795 Q 755 840 720 870 Q 680 895 620 895 Q 540 890 455 875 Q 385 855 355 820 Q 335 785 340 750 Q 345 725 350 715 Z",
      // Australia colliding with Asia
      "M 810 450 Q 850 440 895 450 Q 945 465 980 500 Q 1005 540 1000 590 Q 995 640 960 675 Q 920 705 870 710 Q 820 710 780 685 Q 755 655 755 615 Q 755 570 780 525 Q 795 485 810 450 Z",
      // Small landmass
      "M 750 570 Q 780 565 815 572 Q 850 582 875 605 Q 895 630 890 665 Q 885 695 860 715 Q 830 730 795 725 Q 760 720 740 695 Q 725 670 730 640 Q 735 605 750 575 Z",
      // South America
      "M 230 480 Q 260 465 300 470 Q 340 480 370 505 Q 395 535 395 570 Q 390 610 370 640 Q 345 665 310 670 Q 270 670 240 650 Q 215 625 210 590 Q 205 550 230 480 Z",
      // Main Amasia mass
      "M 320 300 Q 390 270 480 275 Q 580 285 670 315 Q 750 350 795 410 Q 830 470 830 540 Q 825 610 785 670 Q 735 720 665 745 Q 590 760 510 760 Q 430 755 365 730 Q 310 700 280 655 Q 260 605 265 550 Q 270 490 285 430 Q 300 370 320 300 Z",
      // Smaller eastern section
      "M 750 370 Q 785 360 830 367 Q 880 377 920 405 Q 955 440 960 490 Q 965 545 940 595 Q 910 640 865 670 Q 815 695 760 695 Q 710 690 675 660 Q 655 630 655 590 Q 655 545 670 500 Q 685 450 705 405 Q 725 365 750 370 Z",
      // Southern remnant
      "M 300 650 Q 340 640 390 645 Q 445 655 490 685 Q 525 720 525 770 Q 520 820 490 860 Q 455 890 410 895 Q 360 895 320 870 Q 290 840 285 795 Q 280 745 300 650 Z",
      // Central piece
      "M 440 480 Q 475 470 520 475 Q 570 485 605 515 Q 635 550 635 595 Q 630 640 605 675 Q 575 705 535 710 Q 490 710 460 685 Q 435 655 435 615 Q 435 570 440 525 Q 445 500 440 480 Z",
      // Antarctica
      "M 370 760 Q 445 750 535 755 Q 625 760 695 780 Q 755 800 765 840 Q 770 885 735 915 Q 695 940 640 940 Q 560 935 475 920 Q 405 900 370 865 Q 350 830 355 795 Q 360 770 370 760 Z",
      // Eastern fragment
      "M 850 560 Q 880 555 915 562 Q 950 572 975 600 Q 995 630 990 670 Q 985 710 955 735 Q 920 755 880 755 Q 840 750 815 725 Q 795 695 800 660 Q 805 620 820 585 Q 835 565 850 560 Z",
      // United northern mass
      "M 350 280 Q 430 250 520 255 Q 620 265 710 300 Q 785 340 820 400 Q 850 465 850 535 Q 845 605 810 665 Q 765 715 705 745 Q 635 770 560 775 Q 480 775 410 755 Q 350 730 310 690 Q 280 645 275 595 Q 270 540 290 485 Q 310 425 330 365 Q 345 320 350 280 Z",
      // Eastern section
      "M 770 360 Q 810 350 860 357 Q 915 367 960 395 Q 1000 430 1010 480 Q 1015 535 990 585 Q 960 630 915 660 Q 860 685 805 685 Q 755 680 720 655 Q 695 625 695 585 Q 695 540 710 495 Q 725 445 745 395 Q 760 370 770 360 Z",
      // Southern extension
      "M 380 630 Q 430 620 490 625 Q 560 635 615 665 Q 660 700 665 755 Q 670 810 640 855 Q 605 890 555 895 Q 500 895 455 870 Q 420 840 410 795 Q 405 745 420 695 Q 435 660 380 630 Z",
      // Central fragment
      "M 480 480 Q 520 470 570 477 Q 625 487 665 520 Q 695 560 695 610 Q 690 660 660 695 Q 625 725 575 730 Q 525 730 490 705 Q 465 675 465 635 Q 465 590 470 545 Q 475 510 480 480 Z",
      // Antarctica
      "M 380 770 Q 460 760 555 765 Q 650 770 730 790 Q 795 810 805 855 Q 810 905 770 940 Q 725 970 665 970 Q 580 965 490 950 Q 415 930 375 895 Q 350 860 355 820 Q 360 785 380 770 Z",
      // Small northern fragment
      "M 650 290 Q 680 285 715 292 Q 750 302 775 325 Q 795 350 790 385 Q 785 420 760 445 Q 730 465 695 460 Q 660 455 640 430 Q 625 405 630 375 Q 635 340 650 290 Z",
      // Small southern fragment
      "M 630 740 Q 665 735 705 742 Q 745 752 775 775 Q 800 800 795 835 Q 790 870 760 890 Q 725 905 685 900 Q 650 895 630 875 Q 615 850 620 820 Q 625 785 630 74
      // Australia (moving north)
      "M 740 470 Q 770 460 805 465 Q 840 475 865 500 Q 885 525 880 555 Q 875 585 855 605 Q 830 620 795 620 Q 760 615 735 595 Q 715 570 715 540 Q 715 505 740 470 Z",
      // Antarctica
      "M 360 675 Q 430 665 510 670 Q 590 675 650 690 Q 700 705 710 730 Q 715 755 690 770 Q 660 780 610 780 Q 530 775 450 765 Q 380 750 350 725 Q 330 705 340 685 Q 350 670 360 675 Z"
    ],
    rotation: 25,
    color: "#3CB371",
    tectonicActivity: "moderate"
  },
  {
    year: 50000000,
    name: "50M Years Future",
    description: "Pacific closing, Australia collides with Asia",
    continents: [
      // Americas joining
      "M 180 300 Q 220 270 270 265 Q 330 265 380 290 Q 420 315 435 355 Q 445 400 435 450 Q 420 500 390 540 Q 355 575 310 590 Q 260 600 215 585 Q 175 565 155 530 Q 140 490 145 445 Q 150 395 180 300 Z",
      // Afro-Euro-Asia supercontinent forming
      "M 480 280 Q 560 260 650 270 Q 740 290 820 330 Q 880 370 900 425 Q 910 480 890 535 Q 865 580 820 615 Q 765 640 700 650 Q 630 655 565 645 Q 510 630 475 600 Q 455 570 450 535 Q 445 495 480 280 Z",
      // Antarctica
      "M 370 680 Q 440 670 520 675 Q 600 680 660 695 Q 710 710 720 735 Q 725 760 700 775 Q 670 785 620 785 Q 540 780 460 770 Q 390 755 360 730 Q 340 710 350 690 Q 360 675 370 680 Z"
    ],
    rotation: 30,
    color: "#32CD32",
    tectonicActivity: "high"
  },
  {
    year: 100000000,
    name: "100M Years Future",
    description: "New supercontinent assembling",
    continents: [
      // Amasia forming
      "M 350 280 Q 420 250 500 255 Q 590 265 670 295 Q 740 330 780 380 Q 810 430 810 485 Q 805 540 775 585 Q 735 625 680 650 Q 615 670 545 675 Q 470 675 405 660 Q 350 640 320 605 Q 300 570 300 530 Q 300 485 350 280 Z"
    ],
    rotation: 35,
    color: "#90EE90",
    tectonicActivity: "high"
  },
  {
    year: 250000000,
    name: "Pangaea Proxima (250M Future)",
    description: "New supercontinent formed around Arctic",
    continents: [
      // New Pangaea
      "M 380 260 Q 450 230 530 235 Q 620 245 700 275 Q 760 305 795 350 Q 820 400 820 455 Q 815 510 785 560 Q 745 605 690 635 Q 620 660 545 665 Q 465 665 395 645 Q 340 620 305 580 Q 280 540 280 495 Q 280 445 320 385 Q 350 330 380 260 Z"
    ],
    rotation: 40,
    color: "#9ACD32",
    tectonicActivity: "moderate"
  }
];

interface EarthTimelineProps {
  autoPlay?: boolean;
  speed?: number;
  className?: string;
}

export default function EarthTimeline({ autoPlay = false, speed = 4000, className = '' }: EarthTimelineProps) {
  const [currentIndex, setCurrentIndex] = useState(4); // Start at present day
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [globeRotation, setGlobeRotation] = useState(0);
  const [show3D, setShow3D] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % timelineData.length);
        setGlobeRotation((prev) => prev + 40); // Rotate globe on each transition
      }, speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed]);

  // Continuous slow rotation when not playing
  useEffect(() => {
    if (!isPlaying) {
      const rotationInterval = setInterval(() => {
        setGlobeRotation((prev) => (prev + 0.2) % 360);
      }, 50);
      
      return () => clearInterval(rotationInterval);
    }
  }, [isPlaying]);

  useEffect(() => {
    // Smooth progress animation
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progressPercent = Math.min((elapsed / speed) * 100, 100);
      setProgress(progressPercent);

      if (progressPercent < 100 && isPlaying) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [currentIndex, isPlaying, speed]);

  const currentPeriod = timelineData[currentIndex];
  const nextPeriod = timelineData[(currentIndex + 1) % timelineData.length];

  const formatYear = (year: number) => {
    if (year === 0) return "Present Day";
    const absYear = Math.abs(year);
    if (absYear >= 1000000) {
      return `${(absYear / 1000000).toFixed(0)}M years ${year < 0 ? 'ago' : 'future'}`;
    }
    return `${(absYear / 1000).toFixed(0)}K years ${year < 0 ? 'ago' : 'future'}`;
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
    setGlobeRotation((prev) => prev + 40);
  };

  // Calculate tectonic movement intensity
  const getTectonicMovement = () => {
    const activity = currentPeriod.tectonicActivity;
    return activity === 'high' ? 1.5 : activity === 'moderate' ? 1 : 0.5;
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent mb-3">
          🌍 Earth's Continental Timeline 🌏
        </h2>
        <p className="text-gray-400 text-lg">
          Witness tectonic plates shifting through time - from ancient Pangaea to future supercontinents
        </p>
      </div>

      {/* Main Globe Container */}
      <div className="relative bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-500/30">
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 3}s infinite`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: 0.3 + Math.random() * 0.7
              }}
            />
          ))}
        </div>

        {/* Tectonic Activity Indicator */}
        {currentPeriod.tectonicActivity === 'high' && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full backdrop-blur-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-red-300 text-sm font-semibold">High Tectonic Activity</span>
          </div>
        )}

        {/* SVG Globe with 3D effect */}
        <svg
          viewBox="0 0 1000 800"
          className="w-full h-auto"
          style={{ minHeight: '500px' }}
        >
          {/* Definitions */}
          <defs>
            {/* Ocean gradient with depth */}
            <radialGradient id="oceanGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="1"/>
              <stop offset="50%" stopColor="#1e40af" stopOpacity="1"/>
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="1"/>
            </radialGradient>
            
            {/* Sphere gradient for 3D effect */}
            <radialGradient id="sphereGradient" cx="40%" cy="40%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)"/>
              <stop offset="50%" stopColor="rgba(255,255,255,0)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,0.4)"/>
            </radialGradient>

            {/* Continent glow */}
            <filter id="continentGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Tectonic movement effect */}
            <filter id="tectonicShake">
              <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="2" result="turbulence"/>
              <feDisplacementMap in2="turbulence" in="SourceGraphic" scale={getTectonicMovement()} xChannelSelector="R" yChannelSelector="G"/>
            </filter>

            {/* Enhanced 3D depth effect */}
            <filter id="depth3D">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
              <feOffset dx="4" dy="4" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Country border separation effect */}
            <filter id="borderGlow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Globe circle (ocean) */}
          <circle 
            cx="500" 
            cy="400" 
            r="350" 
            fill="url(#oceanGradient)" 
            stroke="#1e40af" 
            strokeWidth="3"
          />

          {/* Rotating latitude/longitude grid */}
          <g 
            stroke="#ffffff" 
            strokeWidth="1" 
            opacity="0.15"
            transform={`rotate(${globeRotation}, 500, 400)`}
          >
            {/* Latitude lines */}
            {[-150, -100, -50, 0, 50, 100, 150].map((y) => (
              <ellipse
                key={`lat${y}`}
                cx="500"
                cy="400"
                rx={350 * Math.cos((y / 180) * Math.PI)}
                ry={Math.abs(y * 1.2)}
                fill="none"
                transform={`translate(0, ${y})`}
              />
            ))}
            
            {/* Longitude lines */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30);
              return (
                <ellipse
                  key={`lon${i}`}
                  cx="500"
                  cy="400"
                  rx="80"
                  ry="350"
                  fill="none"
                  transform={`rotate(${angle}, 500, 400)`}
                />
              );
            })}
          </g>

          {/* Continents group with rotation and tectonic movement */}
          <g 
            transform={`translate(500, 400) rotate(${currentPeriod.rotation + globeRotation}) translate(-500, -400)`}
            filter={currentPeriod.tectonicActivity === 'high' ? 'url(#tectonicShake)' : 'none'}
          >
            {/* Current continents */}
            {currentPeriod.continents.map((path, index) => (
              <g key={`current-${index}`}>
                {/* Deep shadow for 3D depth */}
                {show3D && (
                  <>
                    <path
                      d={path}
                      fill="rgba(0,0,0,0.4)"
                      transform="translate(6, 6)"
                      opacity={0.3 * (1 - (progress / 200))}
                      filter="blur(3px)"
                    />
                    <path
                      d={path}
                      fill="rgba(0,0,0,0.3)"
                      transform="translate(3, 3)"
                      opacity={0.5 * (1 - (progress / 200))}
                    />
                  </>
                )}
                {/* Main continent with enhanced borders */}
                <path
                  d={path}
                  fill={currentPeriod.color}
                  stroke="#2d1810"
                  strokeWidth="3"
                  filter={show3D ? 'url(#depth3D)' : 'url(#continentGlow)'}
                  opacity={1 - (progress / 200)}
                  style={{
                    transition: 'all 0.5s ease-in-out',
                  }}
                >
                  {/* Breathing animation for tectonic activity */}
                  {currentPeriod.tectonicActivity !== 'low' && (
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      values="1;1.015;1"
                      dur={`${4 / getTectonicMovement()}s`}
                      repeatCount="indefinite"
                      additive="sum"
                    />
                  )}
                </path>
                {/* White border outline for clear separation */}
                <path
                  d={path}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  opacity={0.6 * (1 - (progress / 200))}
                  filter="url(#borderGlow)"
                />
                {/* Highlight for 3D effect */}
                {show3D && (
                  <path
                    d={path}
                    fill="url(#sphereGradient)"
                    opacity={0.5 * (1 - (progress / 200))}
                  />
                )}
              </g>
            ))}

            {/* Next continents (morphing in) */}
            {isPlaying && nextPeriod.continents.map((path, index) => (
              <g key={`next-${index}`}>
                {show3D && (
                  <>
                    <path
                      d={path}
                      fill="rgba(0,0,0,0.4)"
                      transform="translate(6, 6)"
                      opacity={0.3 * (progress / 200)}
                      filter="blur(3px)"
                    />
                    <path
                      d={path}
                      fill="rgba(0,0,0,0.3)"
                      transform="translate(3, 3)"
                      opacity={0.5 * (progress / 200)}
                    />
                  </>
                )}
                <path
                  d={path}
                  fill={nextPeriod.color}
                  stroke="#2d1810"
                  strokeWidth="3"
                  filter={show3D ? 'url(#depth3D)' : 'url(#continentGlow)'}
                  opacity={progress / 200}
                  style={{
                    transition: 'all 0.5s ease-in-out',
                  }}
                />
                <path
                  d={path}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  opacity={0.6 * (progress / 200)}
                  filter="url(#borderGlow)"
                />
                {show3D && (
                  <path
                    d={path}
                    fill="url(#sphereGradient)"
                    opacity={0.5 * (progress / 200)}
                  />
                )}
              </g>
            ))}
          </g>

          {/* 3D sphere effects */}
          {show3D && (
            <>
              {/* Inner shadow for depth */}
              <circle 
                cx="500" 
                cy="400" 
                r="348" 
                fill="none" 
                stroke="rgba(0,0,0,0.4)" 
                strokeWidth="4"
                opacity="0.6"
                pointerEvents="none"
              />
              
              {/* 3D sphere highlight overlay */}
              <circle 
                cx="500" 
                cy="400" 
                r="350" 
                fill="url(#sphereGradient)" 
                opacity="0.7"
                pointerEvents="none"
              />

              {/* Atmospheric glow */}
              <circle 
                cx="500" 
                cy="400" 
                r="350" 
                fill="none" 
                stroke="#4a90e2" 
                strokeWidth="2"
                opacity="0.4"
              />

              {/* Outer glow */}
              <circle 
                cx="500" 
                cy="400" 
                r="355" 
                fill="none" 
                stroke="url(#sphereGradient)" 
                strokeWidth="10"
                opacity="0.3"
              />
            </>
          )}

          {/* Period name overlay with better positioning */}
          <g>
            <rect
              x="350"
              y="35"
              width="300"
              height="90"
              fill="rgba(0,0,0,0.6)"
              rx="15"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            <text
              x="500"
              y="70"
              textAnchor="middle"
              fill="#f59e0b"
              fontSize="28"
              fontWeight="bold"
              style={{ 
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))'
              }}
            >
              {currentPeriod.name}
            </text>
            
            <text
              x="500"
              y="100"
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="16"
              fontWeight="600"
              style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
            >
              {formatYear(currentPeriod.year)}
            </text>
          </g>
        </svg>

        {/* Animated progress bar */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-900/80">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 transition-all duration-100 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Info Card with enhanced design */}
      <div className="mt-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-amber-400/40 shadow-2xl relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-full blur-3xl" />
        
        <div className="relative flex items-start gap-6">
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform">
            🌍
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
              {currentPeriod.name}
              {currentPeriod.tectonicActivity === 'high' && (
                <span className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-red-300 text-sm font-semibold">
                  🔥 Active Plates
                </span>
              )}
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg mb-3">{currentPeriod.description}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-full text-amber-400 font-bold">
                📅 {formatYear(currentPeriod.year)}
              </span>
              <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300 font-semibold">
                🌊 Tectonic Activity: {currentPeriod.tectonicActivity}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-6">
        {/* View controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => setShow3D(!show3D)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              show3D 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span className="flex items-center gap-2">
              {show3D ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                  3D Globe Mode
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z"/>
                  </svg>
                  Flat Map Mode
                </>
              )}
            </span>
          </button>
          
          <div className="text-sm text-gray-400">
            {show3D ? '🌍 Realistic 3D sphere with depth' : '🗺️ Simple flat projection'}
          </div>
        </div>

        {/* Play controls */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => goToIndex((currentIndex - 1 + timelineData.length) % timelineData.length)}
            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Era
            </span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-10 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-amber-500/50"
          >
            <span className="flex items-center gap-3">
              {isPlaying ? (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                  Pause Animation
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Play Animation
                </>
              )}
            </span>
          </button>

          <button
            onClick={() => goToIndex((currentIndex + 1) % timelineData.length)}
            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <span className="flex items-center gap-2">
              Next Era
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>

        {/* Timeline dots with enhanced visuals */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
          <h4 className="text-center text-gray-300 font-semibold mb-4">Select Time Period</h4>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {timelineData.map((period, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`
                  group relative
                  w-14 h-14 rounded-xl
                  transition-all duration-300
                  ${index === currentIndex 
                    ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 scale-125 shadow-2xl shadow-amber-500/50 border-2 border-amber-300' 
                    : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 hover:scale-110 border-2 border-gray-600'
                  }
                `}
                title={`${period.name} - ${formatYear(period.year)}`}
              >
                {/* Tooltip */}
                <div className={`
                  absolute -top-20 left-1/2 -translate-x-1/2
                  px-4 py-2 rounded-lg min-w-max
                  bg-gray-900 border border-gray-700 text-white text-sm
                  opacity-0 group-hover:opacity-100
                  transition-all duration-300
                  pointer-events-none
                  z-20
                  shadow-xl
                `}>
                  <div className="font-bold text-amber-400">{period.name}</div>
                  <div className="text-gray-300 text-xs mt-1">{formatYear(period.year)}</div>
                  {/* Arrow */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-gray-700 rotate-45" />
                </div>

                {/* Period indicator */}
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {index + 1}
                </div>

                {/* Activity indicator */}
                {period.tectonicActivity === 'high' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Legend with more detail */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-amber-400/30 shadow-xl">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-xl">
              📚
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">About This Timeline</h4>
              <p className="text-gray-300 leading-relaxed">
                This visualization shows Earth's continental drift across <span className="text-amber-400 font-semibold">450 million years</span> - 
                from 200 million years in the past through the present day to 250 million years in the future.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-400 font-semibold">Low Activity</span>
              </div>
              <p className="text-gray-400 text-sm">Stable continental positions with minimal tectonic movement</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-yellow-400 font-semibold">Moderate Activity</span>
              </div>
              <p className="text-gray-400 text-sm">Continents actively drifting, mountain ranges forming</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                <span className="text-red-400 font-semibold">High Activity</span>
              </div>
              <p className="text-gray-400 text-sm">Major rifting, collisions, and supercontinent formation</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400 text-center">
              🌏 <span className="text-amber-400 font-semibold">Did you know?</span> Tectonic plates move at about the same rate as your fingernails grow - roughly 2-5 cm per year!
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
