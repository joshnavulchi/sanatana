
import styles from './electrical.module.scss';

export default function ElectricalBorder({ title ='Electric Border' }) {
  return (
    <>
      <div className={styles.maincontainer}>
        <svg className={styles.svgcontainer}>
          <defs>
            <filter id="turbulent-displace" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
              <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
                <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
              </feOffset>

              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
              <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
                <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
              </feOffset>

              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="2" />
              <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
                <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
              </feOffset>

              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="2" />
              <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
                <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
              </feOffset>

              <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
              <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
              <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

              <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="30" xChannelSelector="R" yChannelSelector="B" />
            </filter>
          </defs>
        </svg>
        <div className={styles.cardcontainer}>
          <div className={styles.innercontainer}>
            <div className={styles.borderouter}>
              <div className={styles.maincard}>
                <p className={`title`}>{title}</p>
              </div>
            </div>
            <div className={styles.glowlayer1}></div>
            <div className={styles.glowlayer2}></div>
          </div>
          <div className={styles.overlay1}></div>
          <div className={styles.overlay2}></div>
          <div className={styles.backgroundglow}></div>
          <div className={styles.contentcontainer}>
            <p className={`title`}>{title}</p>
          </div>
        </div>
      </div>
    </>
  )
}