FIXTURE ?= order-dashboard

.DEFAULT_GOAL := help
.PHONY: help no-skill with-skill both all install install-dry-run check-version update update-dry-run rollback version

help:
	@echo "======================================================================"
	@echo " Makefile: Quản lý và sử dụng Mobile Web UI/UX Skill"
	@echo " Skill: mobile-web-ui-ux-skill"
	@echo "======================================================================"
	@echo ""
	@echo "1. CÀI ĐẶT & CẬP NHẬT TRONG DỰ ÁN WEB HIỆN HỮU:"
	@echo "  make install DEST=<đường-dẫn-dự-án>"
	@echo "      Cài đặt bản copy project-local độc lập vào .agents/skills/ trong dự án."
	@echo "      Không chỉnh sửa file code, config hay dependencies của ứng dụng."
	@echo ""
	@echo "  make install-dry-run DEST=<đường-dẫn-dự-án>"
	@echo "      Kiểm tra validation payload và môi trường đích; không ghi file (zero writes)."
	@echo ""
	@echo "  make check-version DEST=<đường-dẫn-dự-án>"
	@echo "      So sánh version của skill đã cài trong dự án với version nguồn."
	@echo ""
	@echo "  make update DEST=<đường-dẫn-dự-án>"
	@echo "      Cập nhật an toàn bản cài đặt (tự động tạo backup, rollback khi lỗi)."
	@echo ""
	@echo "  make update-dry-run DEST=<đường-dẫn-dự-án>"
	@echo "      Kiểm tra trước quá trình cập nhật mà không ghi file."
	@echo ""
	@echo "  make rollback DEST=<đường-dẫn-dự-án>"
	@echo "      Khôi phục lại phiên bản trước đó từ bản backup (.mobile-web-ui-ux-skill.bak)."
	@echo ""
	@echo "  make version"
	@echo "      Hiển thị phiên bản hiện tại của mã nguồn skill."
	@echo ""
	@echo "2. TẠO PROJECT TEST ĐỐI CHỨNG (Comparison Projects từ Fixture):"
	@echo "  Mục đích: Tạo 2 bản sao độc lập ('no-skill' và 'with-skill') từ fixture mẫu"
	@echo "  để so sánh quyết định thiết kế mobile web UI/UX của AI coding agent."
	@echo ""
	@echo "  make both DEST=<thư-mục-cha> [FIXTURE=order-dashboard|mobile-form]"
	@echo "      Tạo cả 2 project 'no-skill' và 'with-skill' vào thư mục cha."
	@echo ""
	@echo "  make no-skill DEST=<thư-mục-cha> [FIXTURE=order-dashboard|mobile-form]"
	@echo "      Chỉ tạo project baseline (không kèm skill)."
	@echo ""
	@echo "  make with-skill DEST=<thư-mục-cha> [FIXTURE=order-dashboard|mobile-form]"
	@echo "      Chỉ tạo project candidate (kèm skill tại .agents/skills/)."
	@echo ""
	@echo "Tham số cấu hình:"
	@echo "  DEST         [Bắt buộc] Thư mục dự án hiện hữu (đối với install/update/check-version)"
	@echo "               hoặc thư mục cha đã tồn tại (đối với comparison targets)."
	@echo "  FIXTURE      [Tùy chọn] Tên fixture mẫu cho comparison (mặc định: order-dashboard):"
	@echo "               - order-dashboard : Bảng đơn hàng desktop responsive"
	@echo "               - mobile-form     : Biểu mẫu form mobile phức tạp"
	@echo "======================================================================"

version:
	@python3 scripts/install-skill.py --version

install:
	@test -n "$(DEST)" || { \
		echo "Lỗi: Chưa chỉ định tham số DEST cho target '$@'!" >&2; \
		echo "Cách dùng: make $@ DEST=/duong-dan/du-an-hien-huu" >&2; \
		exit 2; \
	}
	@python3 scripts/install-skill.py --project "$(DEST)"

install-dry-run:
	@test -n "$(DEST)" || { \
		echo "Lỗi: Chưa chỉ định tham số DEST cho target '$@'!" >&2; \
		echo "Cách dùng: make $@ DEST=/duong-dan/du-an-hien-huu" >&2; \
		exit 2; \
	}
	@python3 scripts/install-skill.py --project "$(DEST)" --dry-run

check-version:
	@test -n "$(DEST)" || { \
		echo "Lỗi: Chưa chỉ định tham số DEST cho target '$@'!" >&2; \
		echo "Cách dùng: make $@ DEST=/duong-dan/du-an-hien-huu" >&2; \
		exit 2; \
	}
	@python3 scripts/install-skill.py --project "$(DEST)" --check-version

update:
	@test -n "$(DEST)" || { \
		echo "Lỗi: Chưa chỉ định tham số DEST cho target '$@'!" >&2; \
		echo "Cách dùng: make $@ DEST=/duong-dan/du-an-hien-huu" >&2; \
		exit 2; \
	}
	@python3 scripts/install-skill.py --project "$(DEST)" --update

update-dry-run:
	@test -n "$(DEST)" || { \
		echo "Lỗi: Chưa chỉ định tham số DEST cho target '$@'!" >&2; \
		echo "Cách dùng: make $@ DEST=/duong-dan/du-an-hien-huu" >&2; \
		exit 2; \
	}
	@python3 scripts/install-skill.py --project "$(DEST)" --update --dry-run

rollback:
	@test -n "$(DEST)" || { \
		echo "Lỗi: Chưa chỉ định tham số DEST cho target '$@'!" >&2; \
		echo "Cách dùng: make $@ DEST=/duong-dan/du-an-hien-huu" >&2; \
		exit 2; \
	}
	@python3 scripts/install-skill.py --project "$(DEST)" --rollback

both all:
	@test -n "$(DEST)" || { \
		echo "Lỗi: Chưa chỉ định tham số DEST!" >&2; \
		echo "Cách dùng: make $@ DEST=/duong-dan/thu-muc-cha [FIXTURE=order-dashboard|mobile-form]" >&2; \
		echo "Chạy 'make help' để xem hướng dẫn chi tiết." >&2; \
		exit 2; \
	}
	@$(MAKE) --no-print-directory no-skill DEST="$(DEST)" FIXTURE="$(FIXTURE)"
	@$(MAKE) --no-print-directory with-skill DEST="$(DEST)" FIXTURE="$(FIXTURE)"

no-skill with-skill:
	@test -n "$(DEST)" || { \
		echo "Lỗi: Chưa chỉ định tham số DEST cho target '$@'!" >&2; \
		echo "Cách dùng: make $@ DEST=/duong-dan/thu-muc-cha [FIXTURE=order-dashboard|mobile-form]" >&2; \
		echo "Chạy 'make help' để xem hướng dẫn chi tiết." >&2; \
		exit 2; \
	}
	@python3 scripts/create-comparison-project.py --dest "$(DEST)" --fixture "$(FIXTURE)" --condition "$@"
