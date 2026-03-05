import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
    return (
        <div className="min-h-screen bg-white py-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-hana-primary font-bold mb-8 hover:gap-3 transition-all">
                    <ArrowLeft size={20} />
                    กลับสู่หน้าหลัก
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold text-hana-dark mb-8">ข้อกำหนดการใช้บริการ (Terms of Service)</h1>

                <div className="prose prose-lg text-hana-dark/80">
                    <p className="mb-4">ยินดีต้อนรับสู่ Hanna ("เรา", "พวกเรา" หรือ "ของเรา") โปรดอ่านข้อกำหนดการใช้บริการเหล่านี้อย่างละเอียดก่อนใช้บริการของเรา</p>

                    <h2 className="text-xl font-bold text-hana-dark mt-8 mb-4">1. คำจำกัดความ</h2>
                    <p className="mb-4">"บริการ" หมายถึง บริการผู้ช่วย AI ดูแลสุขภาพผ่านแอปพลิเคชัน LINE และแพลตฟอร์มอื่นๆ ของ Hanna</p>

                    <h2 className="text-xl font-bold text-hana-dark mt-8 mb-4">2. ข้อจำกัดความรับผิดชอบทางการแพทย์</h2>
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                        <p className="font-bold text-red-700 mb-2">คำเตือนสำคัญ:</p>
                        <p className="text-red-600">
                            Hanna ไม่ใช่แพทย์และไม่ได้ให้บริการทางการแพทย์ บริการของเราเป็นเพียงเครื่องมือช่วยในการติดตามและดูแลสุขภาพเบื้องต้นเท่านั้น ข้อมูลที่ได้รับจาก Hanna ไม่สามารถใช้ทดแทนคำแนะนำ การวินิจฉัย หรือการรักษาจากแพทย์ผู้เชี่ยวชาญได้
                        </p>
                    </div>
                    <p className="mb-4">หากท่านมีอาการเจ็บป่วยรุนแรง หรือมีเหตุฉุกเฉินทางการแพทย์ โปรดติดต่อแพทย์หรือโทร 1669 ทันที</p>

                    <h2 className="text-xl font-bold text-hana-dark mt-8 mb-4">3. การใช้งานบริการ</h2>
                    <p className="mb-4">ท่านตกลงที่จะให้ข้อมูลที่เป็นความจริง ถูกต้อง และเป็นปัจจุบันแก่เรา เพื่อให้ Hanna สามารถให้บริการได้อย่างมีประสิทธิภาพสูงสุด</p>

                    <h2 className="text-xl font-bold text-hana-dark mt-8 mb-4">4. การยกเลิกบริการ</h2>
                    <p className="mb-4">ท่านสามารถยกเลิกการใช้บริการได้ตลอดเวลา โดยการแจ้งผ่านช่องทาง LINE Official Account ของเรา</p>

                    <h2 className="text-xl font-bold text-hana-dark mt-8 mb-4">5. การเปลี่ยนแปลงข้อกำหนด</h2>
                    <p className="mb-4">เราสงวนสิทธิ์ในการแก้ไขหรือเปลี่ยนแปลงข้อกำหนดเหล่านี้ได้ตลอดเวลา โดยจะแจ้งให้ทราบผ่านทางเว็บไซต์หรือช่องทางอื่นๆ ของเรา</p>

                    <p className="mt-12 text-sm text-hana-dark/60">แก้ไขล่าสุด: 29 พฤศจิกายน 2568</p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
