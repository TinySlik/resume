require "rake"

namespace :rst do
  desc "Generate reStructuredText file"
  task :generate do
    puts "Generating reStructuredText file from Markdown"
    system("pandoc -s -w rst resume.markdown -o resume.rst")
    puts "Done"
  end
end
namespace :rst_cn do
  desc "Generate reStructuredText file"
  task :generate do
    puts "Generating reStructuredText file from Markdown"
    system("pandoc -s -w rst resume_cn.markdown -o resume_cn.rst")
    puts "Done"
  end
end

namespace :html do
  desc "Compile stylesheet"
  task :styles do
    puts "Compiling CSS file"
    system("compass compile")
  end

  desc "Generate standalone HTML file"
  task :generate => [:styles] do
    puts "Generating standalone HTML file from Markdown"
    system("pandoc -s -S resume.markdown -o resume.html -t html5 --self-contained --section-divs --template=resume-template.html -T \"Tiny's Resume\" -c css/main.css")
    system("sed -n '1,/^<!--changeTag-->/p' index.html >tmp ")
    system("cat <<EOF >>tmp")
    system("sed -n '/^<body>/,$p' resume.html >>tmp")
    system("mv tmp index.html")
    puts "Done"
  end
end
namespace :html_cn do
  desc "Compile stylesheet"
  task :styles do
    puts "Compiling CSS file"
    system("compass compile")
  end

  desc "Generate standalone HTML file"
  task :generate => [:styles] do
    puts "Generating standalone HTML cn file from Markdown"
    system("pandoc -s -S resume_cn.markdown -o resume_cn.html -t html5 --self-contained --section-divs --template=resume-template-cn.html -T \"吴晓的简历\" -c css/main.css")
    system("sed -n '1,/^<!--changeTag-->/p' index.html >tmp ")
    system("cat <<EOF >>tmp")
    system("sed -n '/^<body>/,$p' resume_cn.html >>tmp")
    system("mv tmp index.html")
    puts "Done"
  end
end

namespace :tex_cn do
  desc "Generate LaTeX file"
  task :generate do
    puts "Generating LaTeX file from Markdown"
    system("pandoc -s -w context resume_cn.markdown -o resume_cn.tex")
    puts "Done"
  end
end

namespace :tex do
  desc "Generate LaTeX file"
  task :generate do
    puts "Generating LaTeX file from Markdown"
    system("pandoc -s -w context resume.markdown -o resume.tex")
    puts "Done"
  end
end

namespace :pdf do
  desc "Generate PDF file"
  task :generate => ["tex:generate"] do
    puts "Generating PDF file from LaTeX"
    system("context --pdf resume.tex")
    puts "Done"
  end
end
namespace :pdf_cn do
  desc "Generate PDF file"
  task :generate => ["tex_cn:generate"] do
    puts "Generating cn PDF file from LaTeX"
    system("context --pdf resume_cn.tex")
    puts "Done"
  end
end

namespace :rtf do
  desc "Generate RTF file"
  task :generate do
    puts "Generating RTF file from Markdown"
    system("pandoc -s -S resume.markdown -o resume.rtf")
    puts "Done"
  end
end
namespace :rtf_cn do
  desc "Generate RTF file"
  task :generate do
    puts "Generating RTF file from Markdown"
    system("pandoc -s -S resume_cn.markdown -o resume_cn.rtf")
    puts "Done"
  end
end

namespace :word do
  desc "Generate docx file"
  task :generate do
    puts "Generating docx file from Markdown"
    system("pandoc -s -S resume.markdown -o resume.docx --reference-docx=resume-reference-cn.docx")
    puts "Done"
  end
end
namespace :word_cn do
  desc "Generate docx file"
  task :generate do
    puts "Generating docx file from Markdown"
    system("pandoc -s -S resume_cn.markdown -o resume_cn.docx --reference-docx=resume-reference.docx")
    puts "Done"
  end
end

namespace :odt do
  desc "Generate ODT file"
  task :generate do
    puts "Generating ODT file from Markdown"
    system("pandoc -s -S resume.markdown -o resume.odt")
    puts "Done"
  end
end
namespace :odt_cn do
  desc "Generate ODT file"
  task :generate do
    puts "Generating ODT file from Markdown"
    system("pandoc -s -S resume_cn.markdown -o resume_cn.odt")
    puts "Done"
  end
end

namespace :epub do
  desc "Generate EPUB file"
  task :generate do
    puts "Generating EPUB file from Markdown"
    system("pandoc -s -S resume.markdown -o resume.epub")
    puts "Done"
  end
end
namespace :epub_cn do
  desc "Generate EPUB file"
  task :generate do
    puts "Generating EPUB file from Markdown"
    system("pandoc -s -S resume_cn.markdown -o resume_cn.epub")
    puts "Done"
  end
end

namespace :asciidoc do
  desc "Generate AsciiDoc file"
  task :generate do
    puts "Generating AsciiDoc file from Markdown"
    system("pandoc -s -S resume.markdown -t asciidoc -o resume.txt")
    puts "Done"
  end
end

namespace :docbook do
  desc "Generate DocBook file"
  task :generate do
    puts "Generating DocBook file from Markdown"
    system("pandoc -s -S -w docbook resume.markdown -o resume.db")
    puts "Done"
  end
end

desc "Copy resume to README"
task :readme do
  puts "Copying README"
  system("cp resume.markdown README.markdown")
  puts "Done"
end

desc "update all"
task :update do
  system("git add . -A")
  system("git commit -m'auto commit push'")
  system("git push origin")
  #system("git push second")
  puts "Done"
end

task :update_ch do
  system("git add . -A")
  system("git commit -m'auto commit push'")
  #system("git push origin")
  system("git push second master")
  puts "Done"
end

desc "check to master"
task :check do
  system("git checkout master")
end

desc "check to ch"
task :check_ch do
  system("git checkout ch")
end

desc "Generate all formats"
task :all => [
  "rst:generate",
  "html:generate",
  "pdf:generate",
  "rtf:generate",
  "word:generate",
  "odt:generate",
  "epub:generate",
  "asciidoc:generate",
  "docbook:generate",
  "rst_cn:generate",
  "rtf_cn:generate",
  "word_cn:generate",
  "odt_cn:generate",
  "epub_cn:generate",
  "readme",
  "update",
  "html_cn:generate",
  "update_ch",
]

desc "Generate cn formats"
task :cn => [
  "rst_cn:generate",
  "rtf_cn:generate",
  "word_cn:generate",
  "odt_cn:generate",
  "epub_cn:generate",
  "html_cn:generate",
  "update_ch",
]

desc "Transfer resume files to web"
task :web do
  puts "Transferring files to web..."
  path = "smt@s17r.com:s17r.com/public"
  system("scp resume.* index.html #{path}/resume")
  system("scp index.html #{path}")
  puts "Done"
end

task :default => ["html:generate"]
