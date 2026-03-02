---
title: "ToonShaderを完全に理解したい"
date: "2026-03-01"
author: "みみすけ"
excerpt: "Unityでアニメ調の描画を実現するトゥーンシェーダについて語ります。"
---
こんにちは。Digitartテクノロジー愛好会幹部のみみすけです。
今日は、サークル記事初の技術ブログということで、Unityでアニメ調の描画を実現するトゥーンシェーダについて紹介したいと思います。

## はじめに
**アニメ調の描画**とは何でしょう？おそらく皆さんが想像している通りで合っています。以下のように、モデルに対してきっぱりと色分けがされた表現方法のことです。

![](/images/articles/2026-03-01-01.png)
*画像引用元: [Unity Toon Shader の概要](https://docs.unity3d.com/ja/Packages/com.unity.toonshader@0.8/manual/index.html)*

しかし、このような描画手法がなぜひと手間加わった技術として広く知られているのでしょうか。一見、モデルの表面に単色で塗れば実現できそうなので、簡単なように思えます。

それは、Unityが基本物理ベースの描画を採用しているからです。物体はすべて光源との物理的な計算によって描画され、現実の見た目と近しくなるように計算されています。この計算は常にUnityが勝手にやってくれているので、私たちは特に気にすることなく開発ができるようになっています。

## トゥーンシェーダのしくみ

写実的な物理ベースでのレンダリング（≒描画）をするゲームエンジンの中で、あえてその逆である非写実的なレンダリングをどのように実現しているのでしょうか。考え方はいたってシンプルです。高校で習う内積を知っていれば、すんなりと理解できます。

例として、ある平面とある光源を用意し、以下のようなベクトルを考えます。
![](/images/articles/2026-03-01-03.png)
赤丸は光源、黒線は平面を表します。赤い矢印（$\bm{a}$とします）は光源から平面へ垂直に向かうベクトル、青い矢印（$\bm{b}$とします）は平面の法線ベクトルを表します。どちらも大きさを $1$ として考えます。

この時、ベクトルの内積を計算すると、公式 $\bm{a}\cdot\bm{b}=|\bm{a}||\bm{b}|\cos{θ}$ より、値が $[-1, 1]$ の区間に収まることが分かります。両方のベクトルの向きが相対していたら $1$、直交していれば $0$、同じなら $-1$ というわけです。

この値は両者の関係性を表すパラメータとして機能するので、内積が「値Aから値Bならこの色」という具合にしきい値とその区間での色を決め、各平面に対して割り当てていきます。

## コードに落とし込む
では実際にこの計算をコードに落とし込んでみましょう。Unityでコードを書く際は基本C#ですが、描画に関する処理を描く際はShader言語を用います。

先にコード全体を示します。
```hlsl
Shader "Custom/Toon" {
    // エディタから触れる変数を宣言
    Properties {
        _Color ("Color", Color) = (1,1,1,1)

        // ハイライトの色と閾値
        _HighColor ("Highlight Color", Color) = (1, 1, 1, 1)
        _HighThreshold ("Highlight Threshold", Range(0, 1)) = 0.8
        
        // 通常の色と閾値
        _NormalColor ("Normal Color", Color) = (1, 1, 1, 1)
        
        // 影の色と閾値
        _LowColor ("Shadow Color", Color) = (0.5, 0.5, 0.5, 1)
        _LowThreshold ("Shadow Threshold", Range(0, 1)) = 0.5
    }

    SubShader {
        Tags { "RenderType" = "Opaque" }
        LOD 100

        CGPROGRAM

        #pragma surface surf ToonRamp        
        #pragma target 3.0

        // Propertiesで宣言した変数を再宣言
        fixed4 _Color;
        fixed4 _NormalColor;
        fixed4 _HighColor;
        half _HighThreshold;
        fixed4 _LowColor;
        half _LowThreshold;

        struct Input {
            float dummy;
        };

        /// <summary>
        /// 独自のライティング関数
        /// </summary>
        /// <param name="s">表面の情報</param>
        /// <param name="lightDir">光源方向</param>
        /// <param name="atten">光の減衰係数</param>
        /// <returns>最終的な色</returns>
        fixed4 LightingToonRamp (SurfaceOutput s, fixed3 lightDir, fixed atten)
        {
            // 法線と光源方向との内積を計算
            half d = dot(s.Normal, lightDir) * 0.5 + 0.5;

            fixed3 ramp;
            if (d >= _HighThreshold) {
                ramp = _HighColor.rgb;
            } else if (d >= _LowThreshold) {
                ramp = _NormalColor.rgb;
            } else {
                ramp = _LowColor.rgb;
            }

            // 最終的な色を計算
            // 物体の色 * 光の色 * 影の色 でカラー乗算
            fixed4 c;
            c.rgb = s.Albedo * _LightColor0.rgb * ramp;
            c.a = 0;
            return c;
        }

        /// <summary>
        /// 物体の表面の色だけを決める関数
        /// </summary>
        /// <param name="IN">UV座標データの構造体</param>
        /// <param name="o">結果を格納する構造体</param>
        /// <returns></returns>
        void surf (Input IN, inout SurfaceOutput o) {
            // 単色を指定する
            fixed4 c = _Color;

            // 結果格納
            // アルベドにRGB成分、アルファにA成分を入れる
            o.Albedo = c.rgb;
            o.Alpha = c.a;
        }
        ENDCG
    }
    FallBack "Diffuse"
}
```
まず、Proprtiesセクションでエディタから調整できる変数を用意しておきます。
今回は、ハイライト、通常、影の3色とその間のしきい値を設定できるパラメータを用意しました。
`_Color`はProprtiesの仕様上必要なため置いていますが、今回は無視して大丈夫です。
```hlsl
    Properties {
        _Color ("Color", Color) = (1,1,1,1)

        // ハイライトの色と閾値
        _HighColor ("Highlight Color", Color) = (1, 1, 1, 1)
        _HighThreshold ("Highlight Threshold", Range(0, 1)) = 0.8
        
        // 通常の色と閾値
        _NormalColor ("Normal Color", Color) = (1, 1, 1, 1)
        
        // 影の色と閾値
        _LowColor ("Shadow Color", Color) = (0.5, 0.5, 0.5, 1)
        _LowThreshold ("Shadow Threshold", Range(0, 1)) = 0.5
    }
```
これらの変数がシェーダ計算でも使えるよう、`SubShader`内でも再宣言しておきます。`Properties`は外との窓口、`SubShader`は本質的な処理が記されていると思ってもらって大丈夫です。
```hlsl
// Propertiesで宣言した変数を再宣言
fixed4 _Color;
fixed4 _NormalColor;
fixed4 _HighColor;
half _HighThreshold;
fixed4 _LowColor;
half _LowThreshold;
```
次に述べるのが今回の計算部分です。
モデルの表面の情報や光源の方向ベクトル、減衰係数などを引数として、色（`(r, g, b, a)`の4つのパラメータ）を返す`LightingToonRamp`関数を定義します。

Shaderスクリプトに記載された関数は基本モデルの各面に対して行われるので、この関数の処理も毎フレームにつき面の数だけ行われることになります。

まず、面の情報`s`からの法線情報、光源の方向ベクトルを`dot`関数に与え内積を計算します。引数はどちらも`fixed3`型で、C#で書くところの`Vector3`型に相当します。その計算結果を`0`から`1`の間に収めるため、正規化しています。
```hlsl
half d = dot(s.Normal, lightDir) * 0.5 + 0.5;
```

その後、値によってどの色を割り当てるかを指定します。
```hlsl
fixed3 ramp;
if (d >= _HighThreshold) {
    ramp = _HighColor.rgb;
} else if (d >= _LowThreshold) {
    ramp = _NormalColor.rgb;
} else {
    ramp = _LowColor.rgb;
}
```

代入した色を実際に描画しますが、光源色との計算などで調和した色に変換します。
```hlsl
fixed4 c;
c.rgb = s.Albedo * _LightColor0.rgb * ramp;
```

これによりUnity上でアニメ調の描画が実現されます！
![](/images/articles/2026-03-01-04.png)
左が通常の物理ベースのレンダリング、右が今回作成したシェーダを適応したものです。光源方向との向きに応じてきっぱりと色が分かれていることが分かります。

ただ問題点としてあげられるのは、この色の割り当てが面ごとに行われるため、モデル自体の面数が少ない場合は表面がカクついて見えてしまう問題があります。ローポリの世界観であれば良いかもしれませんが、多くの場合そうではないのでモデルの面数を増やして表面をなだらかにするなどの対策が必要です。

以下の画像のようにRGB値の離れた色を設定した際に、その点が特に目立ってしまいます。
![](/images/articles/2026-03-01-05.png)

## ToonShaderの実用例

トゥーンシェーダを使用したゲームとして有名なのは、原神、Sky、ゼルダの伝説、アークナイツ、など、アニメキャラクターが主人公のゲームに採用されています。

## おわりに
今回は初めての技術記事ということで、トゥーンシェーダについて解説しました。私もまだ勉強中であるので、この記事の内容の正確性が保証できない部分がありますが、ご了承ください。

サークルの活動内容のみではなく、今後もこういった記事を気まぐれに発信していくので、よろしくお願いいたします。当サークルにご興味を持たれましたら、是非 [入会案内ページ](/join)をご覧ください。