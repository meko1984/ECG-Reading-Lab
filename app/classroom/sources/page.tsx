import { AppShell } from '@/app/components/AppShell';
import { appPath } from '@/app/domain/paths';
import styles from '@/app/components/classroom/Classroom.module.css';

export const dynamic = 'force-static';
export const metadata = { title: '実記録の出典とライセンス | ECG lab 教室' };

export default function SourcesPage() {
  return <AppShell title="実記録の出典" backHref="/classroom" contentClassName={styles.shell}>
    <nav className={styles.crumbs} aria-label="パンくず"><a href={appPath('/')}>トップ</a><span>/</span><a href={appPath('/classroom')}>教室</a><span>/</span><span aria-current="page">出典とライセンス</span></nav>
    <header className={styles.hero}><p className={styles.eyebrow}>CREDITS</p><h1>実記録の出典とライセンス</h1><p>波形の元データ、表示方法、引用情報をまとめています。</p></header>
    <section className={styles.section}><h2>PTB-XL v1.0.3</h2><p>教室の実記録は、PhysioNetで配布されるPTB-XLの数値データから描いています。各波形に記録IDと元データへのリンクを表示しています。</p><p><a href="https://physionet.org/content/ptb-xl/1.0.3/">公式配布ページ</a> ／ <a href="https://physionet.org/files/ptb-xl/1.0.3/LICENSE.txt">配布ライセンス</a> ／ <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a></p><p>PTB-XLに由来するデータにはCC BY 4.0が適用されます。原データの著作者を示し、出典・ライセンスへのリンクと変更内容を保持してください。PTB・PhysioNetや原著者による、この教材の監修・推奨を意味しません。データは保証なしで提供されます。</p></section>
    <section className={styles.section}><h2>表示のための変更</h2><ul className={styles.references}><li>500 Hzの記録を、各ヘッダーのgain・baselineからmVへ変換。全サンプルを保持しています。</li><li>25 mm/s・10 mm/mV相当のグリッドで再描画。画面上の実寸を保証する表示ではありません。</li><li>全体表示は全誘導の同じ最初の2.5秒。拡大表示は選択誘導の全記録です。</li><li>誘導の配置、校正表示、拡大、説明用の注釈を追加。信号の平滑化・基線補正・振幅正規化は行っていません。</li><li>模式図は実記録と明確に分けています。所見ラベルは、患者の診断や病因をこの教材が確認したことを意味しません。</li></ul></section>
    <section className={styles.section}><h2>引用情報</h2><ol className={styles.references}>
      <li>Wagner P, Strodthoff N, Bousseljot R, Samek W, Schaeffter T. (2022). PTB-XL, a large publicly available electrocardiography dataset (version 1.0.3). PhysioNet. RRID:SCR_007345. <a href="https://doi.org/10.13026/kfzx-aw45">doi:10.13026/kfzx-aw45</a>.</li>
      <li>Wagner P, Strodthoff N, Bousseljot R-D, Kreiseler D, Lunze FI, Samek W, Schaeffter T. (2020). PTB-XL, a large publicly available electrocardiography dataset. Scientific Data 7, 154. <a href="https://doi.org/10.1038/s41597-020-0495-6">doi:10.1038/s41597-020-0495-6</a>.</li>
      <li>Pollard T, Moody BE, Lehman L, Gow B, Fernandes C, Xie C, Johnson A, Mark RG, Heldt T. (2026). PhysioNet as a global platform for biomedical research. Nature Health 1, 792–795. <a href="https://doi.org/10.1038/s44360-026-00096-z">doi:10.1038/s44360-026-00096-z</a>.</li>
    </ol><p className={styles.note}>公式配布ページの引用指定を2026年9月28日に確認。</p></section>
  </AppShell>;
}
