"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function JoinUs() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-emerald-600 via-green-700 to-teal-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-4xl md:text-6xl mb-6"
            style={{ fontWeight: 700 }}
          >
            Join Us
          </h2>
          <p className="text-xl mb-10 text-white/90 leading-relaxed">
            経験やスキルは問いません。
            <br />
            テクノロジーに興味があれば、誰でも歓迎します。
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              href="/join"
              className="inline-flex items-center justify-center gap-3 bg-white text-emerald-600 px-8 py-4 rounded-full text-lg hover:shadow-2xl transition-shadow duration-300"
              style={{ fontWeight: 700 }}
            >
              Show More
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://auth.digitart.jp/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-emerald-600 px-8 py-4 rounded-full text-lg border-2 border-white hover:bg-white hover:text-emerald-600 transition-all duration-300"
              style={{ fontWeight: 700 }}
            >
              Contact
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
